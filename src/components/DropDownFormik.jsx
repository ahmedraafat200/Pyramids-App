import { useFormikContext, useField } from "formik";
import React, { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

const DropDownFormik = ({ ...props }) => {
    const [openProvider, setOpenProvider] = useState(false);
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);
    return (
        <DropDownPicker
            {...field}
            {...props}
            value={field.value}
            open={openProvider}
            setOpen={setOpenProvider}
            setValue={(val) => {
                setFieldValue(field.name, val());
            }}
        />
    );
};

export default DropDownFormik;