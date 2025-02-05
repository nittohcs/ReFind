/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createFloor } from "../graphql/mutations";
const client = generateClient();
export default function FloorCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    tenantId: "",
    name: "",
    imagePath: "",
    imageWidth: "",
    imageHeight: "",
  };
  const [tenantId, setTenantId] = React.useState(initialValues.tenantId);
  const [name, setName] = React.useState(initialValues.name);
  const [imagePath, setImagePath] = React.useState(initialValues.imagePath);
  const [imageWidth, setImageWidth] = React.useState(initialValues.imageWidth);
  const [imageHeight, setImageHeight] = React.useState(
    initialValues.imageHeight
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setTenantId(initialValues.tenantId);
    setName(initialValues.name);
    setImagePath(initialValues.imagePath);
    setImageWidth(initialValues.imageWidth);
    setImageHeight(initialValues.imageHeight);
    setErrors({});
  };
  const validations = {
    tenantId: [{ type: "Required" }],
    name: [{ type: "Required" }],
    imagePath: [{ type: "Required" }],
    imageWidth: [{ type: "Required" }],
    imageHeight: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          tenantId,
          name,
          imagePath,
          imageWidth,
          imageHeight,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createFloor.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "FloorCreateForm")}
      {...rest}
    >
      <TextField
        label="Tenant id"
        isRequired={true}
        isReadOnly={false}
        value={tenantId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              tenantId: value,
              name,
              imagePath,
              imageWidth,
              imageHeight,
            };
            const result = onChange(modelFields);
            value = result?.tenantId ?? value;
          }
          if (errors.tenantId?.hasError) {
            runValidationTasks("tenantId", value);
          }
          setTenantId(value);
        }}
        onBlur={() => runValidationTasks("tenantId", tenantId)}
        errorMessage={errors.tenantId?.errorMessage}
        hasError={errors.tenantId?.hasError}
        {...getOverrideProps(overrides, "tenantId")}
      ></TextField>
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              tenantId,
              name: value,
              imagePath,
              imageWidth,
              imageHeight,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Image path"
        isRequired={true}
        isReadOnly={false}
        value={imagePath}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              tenantId,
              name,
              imagePath: value,
              imageWidth,
              imageHeight,
            };
            const result = onChange(modelFields);
            value = result?.imagePath ?? value;
          }
          if (errors.imagePath?.hasError) {
            runValidationTasks("imagePath", value);
          }
          setImagePath(value);
        }}
        onBlur={() => runValidationTasks("imagePath", imagePath)}
        errorMessage={errors.imagePath?.errorMessage}
        hasError={errors.imagePath?.hasError}
        {...getOverrideProps(overrides, "imagePath")}
      ></TextField>
      <TextField
        label="Image width"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={imageWidth}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              tenantId,
              name,
              imagePath,
              imageWidth: value,
              imageHeight,
            };
            const result = onChange(modelFields);
            value = result?.imageWidth ?? value;
          }
          if (errors.imageWidth?.hasError) {
            runValidationTasks("imageWidth", value);
          }
          setImageWidth(value);
        }}
        onBlur={() => runValidationTasks("imageWidth", imageWidth)}
        errorMessage={errors.imageWidth?.errorMessage}
        hasError={errors.imageWidth?.hasError}
        {...getOverrideProps(overrides, "imageWidth")}
      ></TextField>
      <TextField
        label="Image height"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={imageHeight}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              tenantId,
              name,
              imagePath,
              imageWidth,
              imageHeight: value,
            };
            const result = onChange(modelFields);
            value = result?.imageHeight ?? value;
          }
          if (errors.imageHeight?.hasError) {
            runValidationTasks("imageHeight", value);
          }
          setImageHeight(value);
        }}
        onBlur={() => runValidationTasks("imageHeight", imageHeight)}
        errorMessage={errors.imageHeight?.errorMessage}
        hasError={errors.imageHeight?.hasError}
        {...getOverrideProps(overrides, "imageHeight")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
