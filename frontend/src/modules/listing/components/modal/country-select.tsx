"use client";

import Select, { SingleValue } from "react-select";
import useCountries, { CountryType } from "../../hooks/useCountries";

interface CountrySelectProps {
    value: CountryType | null | undefined;
    onChange: (value: CountryType | null) => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange }) => {
    const { getAll } = useCountries();

    return (
        <Select
            placeholder="Selecciona un país"
            isClearable
            options={getAll()}
            value={value}
            onChange={(option: SingleValue<CountryType>) => onChange(option ?? null)}
            formatOptionLabel={(option: CountryType) => (
                <div className="flex items-center gap-3">
                    <img
                        src={option.flag}
                        alt={option.label}
                        className="w-7 h-5 object-cover rounded-sm"
                    />
                    <div>
                        {option.label}
                        <span className="text-neutral-500 ml-1">{option.region}</span>
                    </div>
                </div>
            )}
            classNames={{
                control: () => "p-3 border-2",
                input: () => "text-lg",
                option: () => "text-lg",
            }}
            theme={(theme) => ({
                ...theme,
                borderRadius: 6,
                colors: {
                    ...theme.colors,
                    primary: "black",
                    primary25: "#ffe4e6",
                },
            })}
        />
    );
};

export default CountrySelect;
export type { CountryType };
