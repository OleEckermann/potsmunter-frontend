import {extend} from 'vee-validate';
import {required, email} from 'vee-validate/dist/rules';

extend('password', {
    params: ['target'],
    validate(value, { target }) {
        return value === target;
    },
    message: 'Die beiden Passwörter stimmen nicht überein'
});

extend('required', {
    ...required,
    message: '{_field_} darf nicht leer sein'
})

extend('email', {
    ...email,
    message: '{_field_} ist keine gültige E-Mail'
})