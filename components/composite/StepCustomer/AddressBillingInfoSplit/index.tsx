import AddressInput from "@commercelayer/react-components/addresses/AddressInput"
import { Errors } from "@commercelayer/react-components/errors/Errors"
import { ChangeEventHandler, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import tw from "twin.macro"

import { ErrorCss } from "components/ui/form/Error"
import { InputCss } from "components/ui/form/Input"
import { Label } from "components/ui/form/Label"

type TFieldName = Parameters<typeof AddressInput>[0]["name"]

type TInputType = JSX.IntrinsicElements["input"]["type"]
type TResource = Parameters<typeof Errors>[0]["resource"]
type TMessages = Parameters<typeof Errors>[0]["messages"]

interface Props {
  type: TInputType
  fieldName: TFieldName
  resource: TResource
  required?: boolean
  value?: string
}

const SplitInput = ({
  label,
  value,
  required,
  onChange,
  className,
}: {
  label?: string
  value?: string
  required?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  className?: string
}) => (
  <>
    <input
      value={value}
      required={required}
      className={className}
      onChange={onChange}
    />
    <Label>{label}</Label>
  </>
)

export const AddressBillingInfoSplit: React.FC<Props> = ({
  fieldName,
  resource,
  required,
  type,
  value,
}) => {
  const { t } = useTranslation()

  const messages: TMessages = [
    {
      code: "VALIDATION_ERROR",
      resource: "billing_address",
      field: fieldName,
      message: t("input.mustBeValidFormat"),
    },
    {
      code: "VALIDATION_ERROR",
      resource: "shipping_address",
      field: fieldName,
      message: t("input.mustBeValidFormat"),
    },
    {
      code: "EMPTY_ERROR",
      resource: "billing_address",
      field: fieldName,
      message: t("input.cantBlank"),
    },
    {
      code: "EMPTY_ERROR",
      resource: "shipping_address",
      field: fieldName,
      message: t("input.cantBlank"),
    },
  ]

  const labelFiscalCode = t(`addressForm.billing_address_billing_info_1`)
  const labelSdiCode = t(`addressForm.billing_address_billing_info_2`)

  const [valueStatus, setValueStatus] = useState(value)
  const [fiscalOrVatCode, setFiscalOrVatCode] = useState(
    valueStatus ? valueStatus.split(",")[0] : ""
  )
  const [sdiCode, setSdiCode] = useState("")

  const handleFiscalCodeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFiscalOrVatCode(e.currentTarget.value)
    setValueStatus(`${e.currentTarget.value},${sdiCode}`)
  }

  const handleSdiCodeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSdiCode(e.currentTarget.value)
    setValueStatus(`${fiscalOrVatCode},${e.currentTarget.value}`)
  }

  useEffect(() => {
    setValueStatus(value || "")
    const valueSplit = value?.split(",")
    setFiscalOrVatCode(valueSplit ? valueSplit[0] : "")
    setSdiCode(valueSplit && valueSplit.length > 1 ? valueSplit[1] : "")
  }, [value])

  function renderInput() {
    return (
      <>
        <StyledAddressInput
          id={fieldName}
          required={required}
          data-testid={`input_${fieldName}`}
          name={fieldName}
          type={type}
          value={valueStatus}
          className="form-input"
        />
      </>
    )
  }

  return (
    <div>
      <div className="absolute opacity-0">{renderInput()}</div>
      <Grid>
        <div className="mb-8">
          <Wrapper>
            <div className="relative h-10">
              <StyledSplitInput
                label={labelFiscalCode}
                value={fiscalOrVatCode}
                className="form-input"
                required={required}
                onChange={handleFiscalCodeChange}
              />
            </div>
          </Wrapper>
        </div>
        <div className="mb-8">
          <Wrapper>
            <div className="relative h-10">
              <StyledSplitInput
                label={labelSdiCode}
                value={sdiCode}
                className="form-input"
                required={required}
                onChange={handleSdiCodeChange}
              />
            </div>
          </Wrapper>
        </div>
      </Grid>
      <StyledErrors
        data-testid={`error_${fieldName}`}
        resource={resource}
        field={fieldName}
        messages={messages}
      />
    </div>
  )
}

const Wrapper = styled.div`
  position: relative;
`

const StyledAddressInput = styled(AddressInput)`
  ${InputCss}
  &.hasError {
    ${tw`border-red-400 border-2 focus:ring-offset-0 focus:ring-red-400 focus:ring-opacity-50`}
  }
`

const StyledSplitInput = styled(SplitInput)`
  ${InputCss}
  &.hasError {
    ${tw`border-red-400 border-2 focus:ring-offset-0 focus:ring-red-400 focus:ring-opacity-50`}
  }
`

const StyledErrors = styled(Errors)`
  ${ErrorCss}
`

const Grid = styled.div`
  ${tw`grid lg:grid-cols-2 lg:gap-4`}
`
