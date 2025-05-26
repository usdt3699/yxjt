module.exports = {
    purge: {
        enabled: true,
        content: ["./src/**/*.{js,jsx,vue}", "./public/index.html"],
    },
    darkMode: false, // or 'media' or 'class'
    mode: 'jit',
    theme: {
        extend: {
            inset: {
                '-16': '-1rem',
            },
            zIndex: {
                '-10': '-10',
            },
            colors: {
                windBg: '#f4f4f4',
                b333: '#333',
                b666: '#666',
                g999: '#999',
                gccc: '#ccc',
                line: '#f3f3f3',
                primary: '#F49F00',
                cgreen: '#59ef5c',
                cblue: '#0051ff',
                cyellow: '#FFF7EC',
                DBE4FF: '#DBE4FF',
                C3A3DFF: '#3A3DFF',
                C6D7278: '#6D7278',
                FFF6EC: '#FFF6EC',
                FFF7EC: '#FFF7EC',
                F2E2E2E: '#2E2E2E',
                FDA64C: '#FDA64C',
                E7CA98: '#E7CA98',
                E0C28E: '#E0C28E',
                F8574F: '#F8574F',
                F6F6F6: '#F6F6F6',
                EDEDED: '#EDEDED',
                E58201: '#E58201',
            },
            borderColor:{
                E58201: '#E58201',
            },
            fontSize: {
                'base': '14px',
                'lg': '16px',
                'sm': '12px',
                'xlg': '18px',
                'xxl': '24px',
            },
            textColor: {
                'primary': '#F49F00',
                'F7B500': '#F7B500',
                't3E3E3E': '#3E3E3E',
                'C3A3DFF': '#3A3DFF',
                'EDDD9E': '#EDDD9E',
                'T010101': '#010101',
                'FFF6EC': '#FFF6EC',
                'B3B5B7': '#B3B5B7',
                'F4DAA9': '#F4DAA9',
                'T4E4E4E': '#4E4E4E',
                'T898989': '#898989',
                '8A5F4D': '#8A5F4D',
                '724A07': '#724A07',
                'CE6F00': '#CE6F00',
                '838383': '#838383',
            },
            borderWidth: {
                'qr': '3.54px',
                'inner-qr': '0.88px',
            },
            width: {
                'qr-container': '130px',
                'qr': '99.93px',
                'invite-card': '345px',
                'invite-btn': '221px',
            },
            height: {
                'qr-container': '164.93px',
                'qr': '99.93px',
                'invite-card': '271px',
                'invite-btn': '45px',
            },
            spacing: {
                '80': '80px',
                '69': '59px',
                '38': '38px',
                'qr-left': '4px',
                'qr-top': '22px',
                'inner-qr-left': '31.03px',
                'inner-qr-top': '38.8px',
            },
            opacity: {
                '60': '0.6',
            },
            borderRadius: {
                'qr': '19.01px',
                'btn': '77px',
                'card': '20px',
            },
            minWidth: {
                '0': '0',
                '1/5': '20%',
                '1/4': '25%',
                '1/2': '50%',
                '3/4': '75%',
                'full': '100%',
            },
            padding: {
                safe: 'env(safe-area-inset-bottom)'
            },
            margin: {
                safe: 'env(safe-area-inset-bottom)'
            }
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
