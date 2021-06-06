import {extend} from 'vee-validate';
import {required, email} from 'vee-validate/dist/rules';

extend('initialPassword', {
    validate(value) {
        if (!value)
            return true
        return value.length >= 5;
    },
    message: 'Das initiale Passwort muss mindestens 5 Zeichen haben'
})

extend('password', {
    params: ['target'],
    validate(value, {target}) {
        return value === target;
    },
    message: 'Die beiden Passwörter stimmen nicht überein'
});

extend('password', {
    validate(value) {
        if (!value)
            return true
        return value.length >= 15;
    },
    message: 'Das Passwort muss mindestens 15 Zeichen haben'
});

extend('required', {
    ...required,
    message: '{_field_} darf nicht leer sein'
})

extend('email', {
    ...email,
    message: '{_field_} ist keine gültige E-Mail'
})