module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        amd: true,
        mocha: true
    },
    'rules': {
        'global-require': 0,
        'import/no-unresolved': 0,
        'no-param-reassign': 0,
        'no-shadow': 0,
        'import/extensions': 0,
        'import/newline-after-import': 0,
        'no-multi-assign': 0,
        'no-debugger': process.env.NODE_ENV === 'production' ?
            2 :
            0
    }
};