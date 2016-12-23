module.exports = {
    src: {
        css: {
            app: 'src/app/**/*.scss'
        },
        html: {
            app: ['index.html']
        },
        partials: {
            app: ['src/app/**/*.html', '!src/app/index.html']
        },
        js: {
            app: 'src/app/**/!(*.d).{ts,js}',
            appWithoutSpec: 'src/app/**/!(*.d|*.spec|*.e2e).{ts,js}',
            // appTds: ['src/app/typings/index.d.ts', 'src/app/typings-custom/custom.d.ts'],
            tests2e2: 'src/tests-e2e/**/!(*.d).ts',
            tests2e2Tds: 'src/tests-e2e/typings/index.d.ts'
        }
    },

    tmp: {
        client: {
            path: 'dist/app'
        }
    },

    dest: {
        icons: {
            app: 'dist/app/icons'
        },
        css: {
            app: 'dist/app'
        },
        html: {
            app: 'dist'
        },
        partials: {
            app: 'dist/app'
        },
        js: {
            app: 'dist/app',
            tests: 'dist/tests',
            tests2e2: 'dist/tests-e2e'
        }
    }
};