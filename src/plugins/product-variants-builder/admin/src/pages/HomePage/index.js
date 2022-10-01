/*
 *
 * HomePage
 *
 */

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import pluginId from '../../pluginId'
import { Layout, HeaderLayout } from '@strapi/design-system/Layout'
import { Box } from '@strapi/design-system/Box'
import { Button } from '@strapi/design-system/Button'
import Plus from '@strapi/icons/Plus'
import Pencil from '@strapi/icons/Pencil'
import { TextInput } from '@strapi/design-system/TextInput'
import { Select, Option } from '@strapi/design-system/Select'

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

const HomePage = () => {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(undefined)

  console.log('products :>> ', products)

  // useEffect(() => console.log('products :>> ', products), [products])
  // useEffect(() => console.log('search :>> ', search), [search])

  const handleSearch = (value) => {
    console.log('window :>> ', window)
  }

  const getAllProducts = async () => {
    console.log('getAllProducts')
    try {
      let res = await axios(`${STRAPI_ADMIN_BACKEND_URL}/api/products`)
      setProducts(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllProducts()
  }, [])

  return (
    <Box>
      <Layout>
        <HeaderLayout
          // primaryAction={<Button startIcon={<Plus />}>Add an entry</Button>}
          // secondaryAction={
          //   <Button variant="tertiary" startIcon={<Pencil />}>
          //     Edit
          //   </Button>
          // }
          title={capitalize(pluginId.replace(/-/g, ' '))}
          subtitle="Manage product variants easily and quickly"
          as="h2"
        />

        <Box paddingLeft={10} paddingRight={10} paddingBottom={10}>
          <Select
            label="Select a product"
            required
            placeholder={
              selected
                ? products.find((item) => item.id == selected).attributes.title
                : 'select a product'
            }
            onClear={() => setSelected(undefined)}
            value={selected}
            onChange={(value) => setSelected('' + products.find((item) => item.id == value).id)}
          >
            {products.map((item) => (
              <Option value={'' + item.id}>{item.attributes.title}</Option>
            ))}
          </Select>
        </Box>
      </Layout>
    </Box>
  )
}

export default HomePage
