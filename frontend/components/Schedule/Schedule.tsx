import React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BpCheckbox from "../Primitives/CheckBox";
import AlertBox from "../Primitives/AlertBox";
import SelectBox from "../Primitives/Select";
import Button from "../Primitives/Button";
import Text from "../Primitives/Text";
import Flex from "../Primitives/Flex";
import { styled } from "../../stitches.config";
import DatePickerBox from "../Primitives/DatePicker";
import SchemaSelectForm from "../../schema/schemaSelectForm";

const StyledForm = styled("form", Flex, { width: "100%" });

const Seperator = styled(Flex, {
  width: "520px",
  height: "1px",
  backgroundColor: "#CBD2D9",
  alignItems: "center",
  marginBottom: "24px",
  marginTop: "24px",
});

const MasterContainer = styled(Flex, {
  width: "$584",
  height: "968px",
  backGroundColor: "black",
  border: "2px solid black",
  borderRadius: "$12",
  margin: "26px 300px 30px 556px",
  position: "absolute",
});

const MainContainer = styled(Flex, {
  width: "$580",
  height: "800px",
  padding: "25px 32px 25px",
  backgroundColor: "white",
  border: " 1px solid #CBD2D9",
});

const HeadContainer = styled(Flex, {
  height: "72px",
  width: "$580",
  backgroundColor: "white",
  borderRadius: "12px 12px 0px 0px",
  padding: "24px 0px 24px 32px",
});

const EndContainer = styled(Flex, {
  height: "92px",
  width: "$580",
  backgroundColor: "white",
  borderRadius: "0px 0px 12px 12px",
  padding: "24px 32px 24px 343px",
});

const Schedule: React.FC = () => {
  const { register, getValues, handleSubmit, control } = useForm<{
    1: { value: string; label: string };
    2: { value: string; label: string };
    3: { value: string; label: string };
    4: { value: string; label: string };
    5: { value: string; label: string };
    6?: { value: string; label: string };
  }>({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      1: { value: "", label: "" },
      2: { value: "", label: "" },
      3: { value: "", label: "" },
      4: { value: "", label: "" },
      5: { value: "", label: "" },
      6: { value: "", label: "" },
    },
    resolver: zodResolver(SchemaSelectForm),
  });
  return (
    <MasterContainer direction="column">
      <StyledForm
        autoComplete="off"
        direction="column"
        onSubmit={handleSubmit((values: unknown) => {
          console.log(values, getValues(), "Teste");
        })}
      >
        <HeadContainer>
          <Text heading="4" size="lg" css={{}}>
            Set date and time
          </Text>
        </HeadContainer>

        <MainContainer direction="column">
          <AlertBox type="info" text="You're editing the series." />
          <Text size="md" heading="4" css={{ marginTop: "$24", marginBottom: "$8" }}>
            Date and time
          </Text>
          <Flex>
            <DatePickerBox />
          </Flex>
          <Flex css={{ alignSelf: "auto" }}>
            <Flex css={{ width: "252px", marginRight: "16px" }}>
              <Controller
                control={control}
                name="1"
                defaultValue=""
                render={({ field }) => <SelectBox {...field} type="hour" title={"From"} />}
              />
            </Flex>
            <Flex css={{ width: "252px" }}>
              <Controller
                control={control}
                name="2"
                defaultValue=""
                render={({ field }) => <SelectBox {...field} type="hour" title="To" />}
              />
            </Flex>
          </Flex>
          <Seperator />
          <Text size="md" heading="4" css={{}}>
            Repeat
          </Text>
          <Text size="md" css={{}}>
            Repeat every days/weeks/months
          </Text>
          <Flex css={{ alignItems: "center", marginBottom: "", marginTop: "$12" }}>
            <BpCheckbox />
            <Flex css={{ maxWidth: "236px", marginRight: "16px" }}>
              <Controller
                control={control}
                name="3"
                defaultValue=""
                render={({ field }) => (
                  <SelectBox {...field} type="days" title={"Select time range"} />
                )}
              />
            </Flex>
            <Flex css={{ maxWidth: "236px" }}>
              <SelectBox type="times" title="Select time unit" {...register("4")} />
            </Flex>
          </Flex>
          <Flex direction="column" css={{ marginLeft: "32px", marginTop: "7px" }}>
            <Text size="md" css={{}}>
              Occurs every 5 weeks on Monday until:
            </Text>
            <Text
              size="md"
              css={{
                color: "#3589EB",
                margin: "",
                "&:hover": {
                  textDecorationLine: "underline",
                  cursor: "pointer",
                },
              }}
            >
              Choose an end date
            </Text>
          </Flex>
          <Seperator />
          <Text size="md" heading="4" css={{ marginBottom: "2px" }}>
            Reminder
          </Text>
          <Text size="md" css={{ marginBottom: "12px" }}>
            Send reminder minutes/days/weeks before
          </Text>
          <Flex css={{ alignItems: "center", marginBottom: "9px" }}>
            <BpCheckbox />
            <Flex css={{ maxWidth: "236px", marginRight: "16px" }}>
              <SelectBox type="days" title="Select time range" {...register("5")} />
            </Flex>
            <Flex css={{ maxWidth: "236px" }}>
              <SelectBox type="timesBefore" title="Select time unit" {...register("6")} />
            </Flex>
          </Flex>
          <Flex direction="column" css={{ marginLeft: "32px" }}>
            <Flex css={{ alignItems: "center", marginBottom: "-6px" }}>
              <BpCheckbox />
              <Text size="sm">Via Slack</Text>
            </Flex>

            <Flex css={{ alignItems: "center", marginBottom: "7px" }}>
              <BpCheckbox />
              <Text size="sm">Via Email</Text>
            </Flex>

            <Flex css={{ alignItems: "center" }}>
              <BpCheckbox /> <Text size="sm">Remind prefilling the cards</Text>
            </Flex>
          </Flex>
        </MainContainer>

        <EndContainer direction="row">
          <Button type="button" variant="primaryOutline">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            css={{
              marginLeft: "24px",
            }}
          >
            Save
          </Button>
        </EndContainer>
      </StyledForm>
    </MasterContainer>
  );
};

export default Schedule;
