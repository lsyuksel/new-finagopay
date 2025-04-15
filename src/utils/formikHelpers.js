export const getErrorMessage = (formik) => {
    const fields = Object.keys(formik.errors);
    for (const field of fields) {
        if (formik.touched[field] && formik.errors[field]) {
            return formik.errors[field];
        }
    }
    return null;
}; 