import moment from 'moment';

export const horaMes = ( fecha: moment.Moment | undefined ) => {

    const hoyMes = moment( fecha );

    return hoyMes.format('HH:mm');

};