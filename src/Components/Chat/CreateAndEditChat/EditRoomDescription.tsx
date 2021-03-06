import {
    Box,
    Button,
    Input,
    FormControl,
    FormLabel,
    FormErrorMessage,
} from "@chakra-ui/react";
import {Formik, Form, Field, FormikProps, FieldProps, FormikHelpers} from "formik";
import {useHttpClient} from "../../../hooks/http-hook";
import {Toast} from "../../../types/types";

interface MyFormValues {
    description: string;
}

interface Props {
    closeHandler: Function;
    name: string;
    description: string;
    id: string;
    updateRoomDescription: Function
}

const EditRoomDescription: React.FC<Props> = (props: Props) => {
    const {isLoading, error, sendRequest, clearError} = useHttpClient()

    function validateDescription(value: string) {
        let error
        if (value.length > 250) {
            error = "Slow down Shakespeare, that's too many characters."
        }
        return error
    }

    const updateRoomHandler = async (values: MyFormValues, actions: FormikHelpers<MyFormValues>) => {
        actions.setSubmitting(true)
        const body = {
            name: props.name,
            description: values.description
        }

        console.log(body)

        let response: any
        try {
            let toast: Toast = {
                successTitle: "Room Updated",
                successBody: "Remember: if you don't have anything nice to say, don't say anything at all...",
                errorTitle: "Hmmm, something went wrong.",
                errorFallBack: "Couldn't edit your room, please try again.",
            }
            response = await sendRequest("patch", "/api/chat/" + props.id, toast, body)
            if (response.data) {
                actions.resetForm()
                actions.setSubmitting(false)
                props.updateRoomDescription(body.description)
                return props.closeHandler()
            }
        } catch (e) {
            console.log(e)
        }
        actions.setSubmitting(false)
        return
    }

    return (
        <Formik
            initialValues={{
                description: (props.description)
            }}
            onSubmit={(values, actions) => updateRoomHandler(values, actions)}
        >
            {(props: FormikProps<MyFormValues>) => (
                <Form>
                    <Field name="description" validate={validateDescription} mb={"10"}>
                        {({field, form}: FieldProps) => (
                            <FormControl isInvalid={!!form.errors.description && !!form.touched.description}>
                                <FormLabel htmlFor="description">Description</FormLabel>
                                <Input
                                    {...field}
                                    id="description"
                                    placeholder={"Enter description"}
                                    autoComplete={"off"}
                                />
                                <FormErrorMessage>{form.errors.description}</FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>
                </Form>
            )}
        </Formik>
    );
};

export default EditRoomDescription;
