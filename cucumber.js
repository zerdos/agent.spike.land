export default {
    default: {
        requireModule: ['ts-node/register'],
        require: ['features/support/**/*.ts'],
        format: ['progress', 'html:cucumber-report.html'],
        formatOptions: {
            snippetInterface: 'async-await'
        }
    }
};
