module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: '16'
        },
        debug: false,
        useBuiltIns: 'usage',
        corejs: 3,
        shippedProposals: true
      }
    ]
  ],
  plugins: []
};
