module.exports = () => {
  return {
    ckeditor: true,
    'generate-data': {
      enabled: true,
    },
    'product-variants-builder': {
      enabled: true,
      resolve: './src/plugins/product-variants-builder',
    },
  }
}
