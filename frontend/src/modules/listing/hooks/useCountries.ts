import countries from "world-countries";
import i18nCountries from "i18n-iso-countries";
import es from "i18n-iso-countries/langs/es.json";

i18nCountries.registerLocale(es);

export type CountryType = {
    value: string;
    label: string;
    flag: string;
    latlng: number[];
    region: string;
};

const formatedCountries: CountryType[] = countries.map((country) => ({
    value: country.cca2,
    label: i18nCountries.getName(country.cca2, "es") ?? country.name.common,
    flag: `https://flagcdn.com/w20/${country.cca2.toLowerCase()}.png`,
    latlng: country.latlng,
    region: country.region,
}));

const useCountries = () => {
    const getAll = () => formatedCountries;

    const getByValue = (value: string) => {
        return formatedCountries.find((item) => item.value === value) || null;
    };

    return {
        getAll,
        getByValue,
    };
};

export default useCountries;

