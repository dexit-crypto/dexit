import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: '#ffc107',
                secondary: '#ff9800',
                accent: '#009688',
                error: '#f44336',
                warning: '#795548',
                info: '#00bcd4',
                success: '#4caf50'
            },
        },
    },
});
