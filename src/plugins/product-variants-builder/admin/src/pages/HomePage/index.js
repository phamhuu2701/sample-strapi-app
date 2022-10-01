/*
 *
 * HomePage
 *
 */

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import pluginId from '../../pluginId'
import { Layout, HeaderLayout } from '@strapi/design-system/Layout'
import { Box } from '@strapi/design-system/Box'
import { Button } from '@strapi/design-system/Button'
import Plus from '@strapi/icons/Plus'
import Pencil from '@strapi/icons/Pencil'
import { TextInput } from '@strapi/design-system/TextInput'
import { Select, Option } from '@strapi/design-system/Select'
import { Searchbar, SearchForm } from '@strapi/design-system/Searchbar'
import { Typography } from '@strapi/design-system/Typography'
import { Popover } from '@strapi/design-system/Popover'
import './styles.scss'

const { STRAPI_ADMIN_BACKEND_URL } = process.env

const capitalize = (string) => {
  try {
    let _string = Array.from(string)
    _string.forEach((item, index) => {
      if (index === 0) {
        _string[0] = _string[0].toUpperCase()
      } else {
        if ((item.trim() === '' || item === '-') && _string[index + 1]) {
          _string[index + 1] = _string[index + 1].toUpperCase()
        }
      }
    })

    let __string = ''
    _string.forEach((item) => (__string += item))

    return __string
  } catch (error) {
    console.log(error)
    return string
  }
}

const generateVariantTitle = (title, option1, option2, option3) => {
  let _title = title

  if (option1 && option1 !== 'Default') {
    _title += ` ( ${option1} `
    if (option2) {
      _title += `| ${option2} `
    }
    if (option3) {
      _title += `| ${option3} `
    }
    _title += `)`
  }
  return _title
}

const generateVariants = (product, variants) => {
  let Option1 = product.attributes.Option1
  let Option2 = product.attributes.Option2
  let Option3 = product.attributes.Option3

  let defaultVariants = []
  if (Option1 && Option2 && Option3) {
    for (let i = 0; i < Option1.Values.length; i++) {
      for (let j = 0; j < Option2.Values.length; j++) {
        for (let k = 0; k < Option3.Values.length; k++) {
          defaultVariants.push({
            product: product.id,
            title: generateVariantTitle(
              product.attributes.title,
              Option1.Values[i].value,
              Option2.Values[j].value,
              Option3.Values[k].value
            ),
            descriptionHtml: product.attributes.descriptionHtml,
            price: product.attributes.price,
            compareAtPrice: product.attributes.compareAtPrice,
            option1: Option1.Values[i].value,
            option2: Option2.Values[j].value,
            option3: Option3.Values[k].value,
          })
        }
      }
    }
  } else if (Option1 && Option2) {
    for (let i = 0; i < Option1.Values.length; i++) {
      for (let j = 0; j < Option2.Values.length; j++) {
        defaultVariants.push({
          product: product.id,
          title: generateVariantTitle(
            product.attributes.title,
            Option1.Values[i].value,
            Option2.Values[j].value,
            null
          ),
          descriptionHtml: product.attributes.descriptionHtml,
          price: product.attributes.price,
          compareAtPrice: product.attributes.compareAtPrice,
          option1: Option1.Values[i].value,
          option2: Option2.Values[j].value,
          option3: null,
        })
      }
    }
  } else if (Option1) {
    for (let i = 0; i < Option1.Values.length; i++) {
      defaultVariants.push({
        product: product.id,
        title: generateVariantTitle(product.attributes.title, Option1.Values[i].value, null, null),
        descriptionHtml: product.attributes.descriptionHtml,
        price: product.attributes.price,
        compareAtPrice: product.attributes.compareAtPrice,
        option1: Option1.Values[i].value,
        option2: null,
        option3: null,
      })
    }
  } else {
    defaultVariants.push({
      product: product.id,
      title: product.attributes.title,
      descriptionHtml: product.attributes.descriptionHtml,
      price: product.attributes.price,
      compareAtPrice: product.attributes.compareAtPrice,
      option1: null,
      option2: null,
      option3: null,
    })
  }

  let createdVariants = variants.map((item) => ({
    id: item.id,
    product: product.id,
    title: item.attributes.title || product.attributes.title,
    descriptionHtml: item.attributes.descriptionHtml || product.attributes.descriptionHtml,
    price: item.attributes.price || product.attributes.price,
    compareAtPrice: item.attributes.compareAtPrice || product.attributes.compareAtPrice,
    option1: item.attributes.option1,
    option2: item.attributes.option2,
    option3: item.attributes.option3,
  }))

  let _variants = []
  for (let i = 0; i < defaultVariants.length; i++) {
    let defaultVariant = defaultVariants[i]
    let createdVariant = createdVariants.find(
      (item) =>
        item.option1 === defaultVariant.option1 &&
        item.option2 === defaultVariant.option2 &&
        item.option3 === defaultVariant.option3
    )

    if (createdVariant) {
      defaultVariant = {
        ...defaultVariant,
        id: createdVariant.id,
        title: createdVariant.title,
        descriptionHtml: createdVariant.descriptionHtml,
        price: createdVariant.price,
        compareAtPrice: createdVariant.compareAtPrice,
      }
    }

    _variants[i] = defaultVariant
  }

  return _variants
}

const _getAllProducts = async () => {
  try {
    return new Promise(async (resolve, reject) => {
      let res = null
      let items = []
      let page = 1

      while (page >= 1) {
        res = await axios(
          `${STRAPI_ADMIN_BACKEND_URL}/api/products?populate[vendor][populate]=*&populate[type][populate]=*&populate[images][populate]=*&populate[Option1][populate]=*&populate[Option2][populate]=*&populate[Option3][populate]=*&pagination[page]=${page}&pagination[pageSize]=100`
        )

        items = items.concat(res.data.data)
        page = res.data.meta.pagination.page < res.data.meta.pagination.pageCount ? page + 1 : -1
      }

      resolve(items)
    })
  } catch (error) {
    console.log(error)
  }
}

const HomePage = () => {
  const searchRef = useRef()

  const [products, setProducts] = useState([])
  const [productSelected, setProductSelected] = useState(null)
  const [variants, setVariants] = useState(null)
  const [search, setSearch] = useState('')
  const [visible, setVisible] = useState(false)

  console.log('productSelected :>> ', productSelected)
  console.log('variants :>> ', variants)

  const getAllProducts = async () => {
    try {
      let _products = await _getAllProducts()
      setProducts(_products)
    } catch (error) {
      console.log(error)
    }
  }

  const getVariants = async (product) => {
    try {
      let variants = await axios(
        `${STRAPI_ADMIN_BACKEND_URL}/api/product-variants?populate=*&filters[product][id][$eq]=${product.id}`
      ).then((res) => res.data.data)

      variants = generateVariants(product, variants)

      setVariants(variants)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async () => {
    try {
      let created = variants.filter((item) => !item.id)
      let updated = variants.filter((item) => item.id)

      for (let i = 0; i < created.length; i++) {
        let res = await axios({
          url: `${STRAPI_ADMIN_BACKEND_URL}/api/product-variants`,
          method: 'POST',
          data: { data: created[i] },
        })
        console.log(`[${i + 1}/${created.length}] product variant created`)
      }

      for (let i = 0; i < updated.length; i++) {
        let res = await axios({
          url: `${STRAPI_ADMIN_BACKEND_URL}/api/product-variants/${updated[i].id}`,
          method: 'PUT',
          data: { data: updated[i] },
        })
        console.log(`[${i + 1}/${created.length}] product variant updated`)
      }

      await getVariants(productSelected)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllProducts()

    window.addEventListener('click', (e) => {
      if (e && e.target) {
        const checkAutocompleteClicked = (el) => {
          if (!el) {
            return false
          }

          if (el.id === 'autocomplete') {
            return true
          }

          return checkAutocompleteClicked(el.parentElement)
        }

        let bool = checkAutocompleteClicked(e.target)

        setVisible(bool)
      } else {
        setVisible(false)
      }
    })

    return () => {
      window.removeEventListener('click', () => {
        console.log(`click event removed`)
      })
    }
  }, [])

  let productOptions = products
    ? search
      ? products.filter((item) => item.attributes.title.includes(search))
      : products
    : []
  productOptions = productOptions.slice(0, 5)

  return (
    <Box>
      <Layout>
        <HeaderLayout
          title={capitalize(pluginId.replace(/-/g, ' '))}
          subtitle="Manage product variants easily and quickly"
          as="h2"
        />

        <Box paddingLeft={10} paddingRight={10} paddingBottom={10}>
          <div id="autocomplete" ref={searchRef} onClick={() => setVisible(true)}>
            <SearchForm>
              <Searchbar
                label=""
                name="searchbar"
                clearLabel=""
                onClear={() => setSearch('')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search"
              >
                Searching for a plugin
              </Searchbar>
            </SearchForm>
          </div>
          {visible > 0 && (
            <Popover source={searchRef} spacing={8}>
              <ul style={{ cursor: 'pointer' }}>
                {productOptions.map((item, index) => (
                  <Box
                    key={index}
                    padding={3}
                    as="li"
                    onClick={() => {
                      setSearch(item.attributes.title)
                      setProductSelected(item)
                      getVariants(item)
                    }}
                  >
                    {item.attributes.title}
                  </Box>
                ))}
              </ul>
            </Popover>
          )}
        </Box>

        <Box paddingLeft={10} paddingRight={10} paddingBottom={4}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </Box>

        {variants && (
          <Box paddingLeft={10} paddingRight={10} paddingBottom={10}>
            <div className="table-block">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Compare At Price</th>
                    <th>Option 1</th>
                    <th>Option 2</th>
                    <th>Option 3</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((item, index) => (
                    <tr key={index}>
                      <td style={{ textAlign: 'center' }}>{item.id}</td>
                      <td>{item.title}</td>
                      <td style={{ textAlign: 'center' }}>{item.price}</td>
                      <td style={{ textAlign: 'center' }}>{item.compareAtPrice}</td>
                      <td style={{ textAlign: 'center' }}>{item.option1}</td>
                      <td style={{ textAlign: 'center' }}>{item.option2}</td>
                      <td style={{ textAlign: 'center' }}>{item.option3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Box>
        )}
      </Layout>
    </Box>
  )
}

export default HomePage
