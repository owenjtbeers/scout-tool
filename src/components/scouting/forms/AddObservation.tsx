import React, { useState } from "react";
import { ScrollView, View, ActivityIndicator, Touchable } from "react-native";
import {
  Button,
  useTheme,
  Dialog,
  Text,
  FAB,
  SearchBar,
  ListItem,
  Input,
} from "@rneui/themed";
import {
  Control,
  set,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import { ScoutingReportForm } from "../types";
import { Alias, ObservationTypePrefix } from "../../../redux/scouting/types";
import { getObservationSetForAlias } from "../utils/scoutReportUtils";
import { WeedIcon, GeneralIcon, InsectIcon, DiseaseIcon } from "../icons/Icons";
import { Question } from "./Question";

// TODO
// [] Validation
// --- [] Cannot add the same observation twice
// --- [] Must select a type
// --- [] Must select a name
// --- [] Cannot add an observation with the same name as an existing alias
// [] Loading state
// [] Error handling
// [] Picklist should be going through drafted reports to find all unique aliases
// [] Close Button on Dialog

interface AddObservationProps {
  formGetValues: UseFormGetValues<ScoutingReportForm>;
  formSetValue: UseFormSetValue<ScoutingReportForm>;
  formControl: Control<ScoutingReportForm>;
  aliasList: Alias[];
  isLoadingAliasList: boolean;
}
export const AddObservation = (props: AddObservationProps) => {
  const { theme } = useTheme();
  const {
    formSetValue,
    formGetValues,
    formControl,
    aliasList,
    isLoadingAliasList,
  } = props;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {modalOpen && (
        <AddObservationDialogContent
          formSetValue={formSetValue}
          formGetValues={formGetValues}
          formControl={formControl}
          onClose={() => setModalOpen(false)}
          isLoadingData={isLoadingAliasList}
          aliasList={aliasList}
        />
      )}
      <AddObservationButton onPress={() => setModalOpen(true)} />
    </>
  );
};

interface AddObservationDialogContentProps {
  formSetValue: UseFormSetValue<ScoutingReportForm>;
  formGetValues: UseFormGetValues<ScoutingReportForm>;
  formControl: Control<ScoutingReportForm>;
  onClose: () => void;
  isLoadingData: boolean;
  aliasList: Alias[];
}
type AddObservationWizardStep =
  | "search"
  | "specify-name"
  | "select-type"
  | "answer-questions";
const AddObservationDialogContent = (
  props: AddObservationDialogContentProps
) => {
  const { theme } = useTheme();
  const { onClose, formSetValue, formGetValues, aliasList, formControl } =
    props;
  const [currentStep, setCurrentStep] =
    useState<AddObservationWizardStep>("search");
  const [newPestName, setNewPestName] = useState("");
  const [selectedType, setSelectedType] = useState<
    ObservationTypePrefix | undefined
  >(undefined);

  return (
    <Dialog isVisible={true} onDismiss={onClose} onBackdropPress={onClose}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Dialog.Title title={"Add Observation"}></Dialog.Title>
        <Button title="Close" onPress={onClose} />
      </View>
      {currentStep === "search" && (
        <AddObservationSearchStep
          setWizardStep={setCurrentStep}
          setNewPestName={setNewPestName}
          picklist={aliasList}
          formSetValue={formSetValue}
          formGetValues={formGetValues}
          isLoadingData={props.isLoadingData}
          setSelectedType={setSelectedType}
        />
      )}
      {currentStep === "specify-name" && (
        <AddObservationSpecifyNameStep
          setWizardStep={setCurrentStep}
          newPestName={newPestName}
          setNewPestName={setNewPestName}
        />
      )}
      {currentStep === "select-type" && (
        <AddObservationSelectTypeStep
          formSetValue={formSetValue}
          setWizardStep={setCurrentStep}
          newPestName={newPestName}
          formGetValues={formGetValues}
          setSelectedType={setSelectedType}
        />
      )}
      {currentStep === "answer-questions" && (
        <AddObservationAnswerQuestionsStep
          selectedType={selectedType as ObservationTypePrefix}
          newPestName={newPestName}
          formGetValues={formGetValues}
          formControl={formControl}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
};

interface AddObservationSearchProps {
  picklist: Alias[];
  setNewPestName: (name: string) => void;
  setWizardStep: (step: AddObservationWizardStep) => void;
  formSetValue: UseFormSetValue<ScoutingReportForm>;
  formGetValues: UseFormGetValues<ScoutingReportForm>;
  setSelectedType: (type: ObservationTypePrefix) => void;
  isLoadingData: boolean;
}
const AddObservationSearchStep = (props: AddObservationSearchProps) => {
  const {
    setWizardStep,
    setNewPestName,
    formSetValue,
    formGetValues,
    setSelectedType,
    isLoadingData,
  } = props;
  const [searchValue, setSearchValue] = useState("");
  return (
    <ScrollView style={{ maxHeight: "90%" }}>
      <SearchBar
        placeholder="Search, or specify new name of pest"
        onChangeText={setSearchValue}
        value={searchValue}
      />
      {searchValue.length > 1 && (
        <Button
          onPress={() => {
            setNewPestName(searchValue);
            setWizardStep("specify-name");
          }}
        >{`Add ${searchValue} as a new pest?`}</Button>
      )}
      {isLoadingData && <ActivityIndicator animating />}
      {props.picklist
        .filter((pick) =>
          pick.Name.toLowerCase().includes(searchValue.toLowerCase())
        )
        .map((pick) => (
          <ListItem
            key={`${pick.Type}-${pick.Name}`}
            onPress={() => {
              if (pick.Type) {
                const observations = getObservationSetForAlias(pick);
                formSetValue(`scoutingAreas.0.${pick.Type}Observations`, [
                  ...formGetValues(`scoutingAreas.0.${pick.Type}Observations`),
                  ...observations,
                ]);
                setNewPestName(pick.Name);
                setSelectedType(pick.Type);
                setWizardStep("answer-questions");
              }
            }}
          >
            <ListItem.Content>
              <ListItem.Title>
                {pick.Name}
                <ListItem.Subtitle right>{pick.Type}</ListItem.Subtitle>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
    </ScrollView>
  );
};

interface AddObservationSpecifyNameProps {
  setNewPestName: (name: string) => void;
  newPestName: string;
  setWizardStep: (step: AddObservationWizardStep) => void;
}
const AddObservationSpecifyNameStep = (
  props: AddObservationSpecifyNameProps
) => {
  const { theme } = useTheme();
  const { setWizardStep, setNewPestName, newPestName } = props;
  return (
    <View>
      <Input
        label="New Pest Name"
        value={props.newPestName}
        onChangeText={props.setNewPestName}
      />
      <Button title="Back" onPress={() => setWizardStep("search")} />
      <Button title="Next" onPress={() => setWizardStep("select-type")} />
    </View>
  );
};

interface AddObservationSelectTypeProps {
  newPestName: string;
  setSelectedType: (type: ObservationTypePrefix) => void;
  setWizardStep: (step: AddObservationWizardStep) => void;
  formSetValue: UseFormSetValue<ScoutingReportForm>;
  formGetValues: UseFormGetValues<ScoutingReportForm>;
}
const AddObservationSelectTypeStep = (props: AddObservationSelectTypeProps) => {
  const { theme } = useTheme();
  const { newPestName, setWizardStep, setSelectedType } = props;

  const onPressType = (type: ObservationTypePrefix) => () => {
    const alias = { Name: newPestName, Type: type, ID: 0 };
    props.formSetValue(`scoutingAreas.0.${type}Observations`, [
      ...props.formGetValues(`scoutingAreas.0.${type}Observations`),
      ...getObservationSetForAlias(alias),
    ]);
    setSelectedType(type);
    setWizardStep("answer-questions");
  };
  return (
    <View>
      <Dialog.Title title={`Select Type for ${props.newPestName}`} />
      <View>
        <Button
          iconRight
          title={"Weed"}
          icon={<WeedIcon size={48} color={theme.colors.secondary} />}
          onPress={onPressType("Weed")}
        />
        <Button
          iconRight
          title={"Insect"}
          icon={<InsectIcon size={48} color={theme.colors.secondary} />}
          onPress={onPressType("Insect")}
        />
        <Button
          iconRight
          title={"Disease"}
          icon={<DiseaseIcon size={48} color={theme.colors.secondary} />}
          onPress={onPressType("Disease")}
        />
        <Button
          iconRight
          title={"General"}
          icon={<GeneralIcon size={48} color={theme.colors.secondary} />}
          onPress={onPressType("General")}
        />
      </View>
    </View>
  );
};

interface AddObservationAnswerQuestionsProps {
  selectedType: ObservationTypePrefix;
  newPestName: string;
  formGetValues: UseFormGetValues<ScoutingReportForm>;
  formControl: Control<ScoutingReportForm>;
  onClose: () => void;
}
const AddObservationAnswerQuestionsStep = (
  props: AddObservationAnswerQuestionsProps
) => {
  const { formGetValues, formControl, selectedType, onClose } = props;
  const observations = formGetValues(
    `scoutingAreas.0.${selectedType}Observations`
  );
  const mappedObservations = observations.map((obs, index) => ({
    ...obs,
    formIndex: index,
  }));
  const questionsForAlias = mappedObservations.filter(
    (obs) => obs.Alias.Name === props.newPestName
  );
  return (
    <>
      <Text>
        * You can leave blank and continue if you so please. You can edit later
        by selecting from the left hand panel *
      </Text>
      {questionsForAlias.map((observation, index) => {
        return (
          <Question
            key={`${props.newPestName}-observation-${index}`}
            observation={observation}
            formControl={formControl}
            formValueName={`scoutingAreas.0.${selectedType}Observations.${observation.formIndex}.value`}
          />
        );
      })}
      <Button title={"CONTINUE"} onPress={onClose} />
    </>
  );
};

interface AddObservationButtonProps {
  onPress: () => void;
}
const AddObservationButton = (props: AddObservationButtonProps) => {
  const { theme } = useTheme();
  return (
    <Button
      icon={{ name: "add", size: 48, color: theme.colors.secondary }}
      title={"ADD OBSERVATION"}
      radius={20}
      raised={true}
      containerStyle={{
        maxWidth: "95%",
        minWidth: "85%",
        margin: "auto",
        backgroundColor: "transparent",
        overflow: "hidden",
      }}
      onPress={props?.onPress}
    />
  );
};
