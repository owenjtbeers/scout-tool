import React, { useState } from "react";
import { Button, Text, Dialog, ListItem } from "@rneui/themed";
import { View, StyleSheet, GestureResponderEvent } from "react-native";
import { scoutFormStyles } from "./styles";
import { globalStyles } from "../../../constants/styles";
import type { Alias } from "../../../redux/scouting/types";
import { useTheme, SearchBar, Input } from "@rneui/themed";
import { ErrorMessage } from "../../../forms/components/ErrorMessage";

interface GeneralQuestionPromptProps {
  type: "General";
  recentlyObserved: Map<string, number>;
  createQuestion: (questionName: string) => void;
  getAddedGeneralQuestionsForArea: () => string[];
}

const GeneralQuestionPrompt = (props: GeneralQuestionPromptProps) => {
  const {
    type,
    createQuestion,
    recentlyObserved,
    getAddedGeneralQuestionsForArea,
  } = props;
  const [itemsAdded, setItemsAdded] = useState<string[]>([]);
  const [newItemsAdded, setNewItemsAdded] = useState(false);
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const [showAddOptionDialog, setShowAddOptionDialog] = useState(false);
  const [addValue, setAddValue] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState("");

  const handleItemPress = (item: string) => (event: GestureResponderEvent) => {
    if (itemsAdded.includes(item)) {
      setItemsAdded(itemsAdded.filter((i) => i !== item));
    } else {
      const generalQuestionNames = getAddedGeneralQuestionsForArea();
      if (!generalQuestionNames.includes(item)) {
        setNewItemsAdded(true);
        setItemsAdded([...itemsAdded, item]);
      }
    }
  };

  const handleYesClick = () => {
    setShowOptionsDialog(true);
  };

  const handleNoClick = () => {
    setIsAnswered(true);
  };

  const handleOptionsDialogClose = () => {
    setShowOptionsDialog(false);
    setShowAddOptionDialog(false);

    itemsAdded.forEach((item) => {
      const addedItems = getAddedGeneralQuestionsForArea();
      if (!addedItems.includes(item)) {
        createQuestion(item);
      }
    });
    setNewItemsAdded(false);
    setItemsAdded([]);
    setSearchValue("");
  };

  // Set the items clicked to the added aliases
  React.useEffect(() => {
    const addedAliases = getAddedGeneralQuestionsForArea();
    if (addedAliases.length > 0) {
      setItemsAdded(addedAliases);
      setIsAnswered(true);
    }
  }, []);
  return (
    <View style={scoutFormStyles.section}>
      <ListItem.Accordion
        isExpanded={isAnswered}
        onPress={() => setIsAnswered(!isAnswered)}
        content={
          <View style={{ display: "flex", flex: 1, backgroundColor: "white" }}>
            <Text
              style={globalStyles.centerText}
            >{`Is there anything else you would like to record?`}</Text>
          </View>
        }
      >
        <View style={{ ...styles.buttonContainer, backgroundColor: "white" }}>
          <Button title="Yes" onPress={handleYesClick} />
          <Button title="No" onPress={handleNoClick} />
        </View>
        <Dialog
          isVisible={showOptionsDialog}
          onDismiss={handleOptionsDialogClose}
          onBackdropPress={handleOptionsDialogClose}
        >
          {!showAddOptionDialog && (
            <OptionsPicklist
              type={type}
              getAddedItems={getAddedGeneralQuestionsForArea}
              recentlyObserved={recentlyObserved}
              setShowAddOptionDialog={setShowAddOptionDialog}
              searchValue={searchValue}
              setAddValue={setAddValue}
              setSearchValue={setSearchValue}
              itemsAdded={itemsAdded}
              setItemsAdded={setItemsAdded}
              newItemsAdded={newItemsAdded}
              setNewItemsAdded={setNewItemsAdded}
              setShowOptionsDialog={setShowOptionsDialog}
              showOptionsDialog={showOptionsDialog}
              handleItemPress={handleItemPress}
              handleOptionsDialogClose={handleOptionsDialogClose}
            />
          )}
          {showAddOptionDialog && (
            <AddOptionMenu
              type={type}
              error={error}
              addValue={addValue}
              setAddValue={setAddValue}
              setError={setError}
              setShowAddOptionDialog={setShowAddOptionDialog}
              setShowOptionsDialog={setShowOptionsDialog}
              createQuestion={createQuestion}
              getAddedItems={getAddedGeneralQuestionsForArea}
            />
          )}
        </Dialog>
      </ListItem.Accordion>
    </View>
  );
};

interface OptionsPicklistProps {
  type: "General";
  getAddedItems: () => string[];
  recentlyObserved: Map<string, number>;
  setShowAddOptionDialog: (show: boolean) => void;
  setAddValue: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  itemsAdded: string[];
  setItemsAdded: (value: string[]) => void;
  newItemsAdded: boolean;
  setNewItemsAdded: (value: boolean) => void;
  setShowOptionsDialog: (show: boolean) => void;
  showOptionsDialog: boolean;
  handleItemPress: (item: string) => (event: GestureResponderEvent) => void;
  handleOptionsDialogClose: () => void;
}
export const OptionsPicklist = (props: OptionsPicklistProps) => {
  const {
    type,
    getAddedItems,
    recentlyObserved,
    setShowAddOptionDialog,
    setSearchValue,
    searchValue,
    handleItemPress,
    itemsAdded,
    newItemsAdded,
    handleOptionsDialogClose,
  } = props;
  const { theme } = useTheme();
  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Dialog.Title title={props.type} />
        <Button
          title={"Add"}
          style={{
            // flex: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setShowAddOptionDialog(true)}
        />
      </View>
      <SearchBar
        placeholder="Search"
        onChangeText={setSearchValue}
        value={searchValue}
      />
      {recentlyObserved.size > 0 && (
        <ListItem bottomDivider>
          <Text>Recently Observed</Text>
        </ListItem>
      )}
      {recentlyObserved.size > 0 &&
        Array.from(recentlyObserved)
          .filter(([item]) => item.includes(searchValue))
          .sort((a, b) => a[1] - b[1])
          .map(([item, count]) => (
            <ListItem
              key={item}
              // TODO: This needs to have the correct ID
              onPress={handleItemPress(item)}
              bottomDivider
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <ListItem.CheckBox
                  checked={
                    !!itemsAdded.find((clickeditem) => item === clickeditem) ||
                    !!getAddedItems().find((a) => a === item)
                  }
                  // onPress={handleItemPress(question)}
                />
                <Text>{item}</Text>
                <Text>{`  ${count} times`}</Text>
              </View>
            </ListItem>
          ))}
      <Button
        title={newItemsAdded ? `Add new Question(s)` : "Close"}
        onPress={handleOptionsDialogClose}
      />
    </>
  );
};

interface AddOptionMenuProps {
  type: "General";
  error: string;
  addValue: string;
  setAddValue: (value: string) => void;
  setError: (value: string) => void;
  setShowAddOptionDialog: (show: boolean) => void;
  setShowOptionsDialog: (show: boolean) => void;
  createQuestion: (itemName: string) => void;
  getAddedItems: () => string[];
}
const AddOptionMenu = (props: AddOptionMenuProps) => {
  const {
    type,
    error,
    addValue,
    setAddValue,
    setError,
    setShowAddOptionDialog,
    setShowOptionsDialog,
    createQuestion,
    getAddedItems,
  } = props;
  return (
    <>
      <Dialog.Title title={`Add ${type}`} />
      {error !== "" && <ErrorMessage message={error} />}
      <Input
        label={`Question Name`}
        placeholder={`New Question name`}
        onChangeText={setAddValue}
        value={addValue}
      />
      <Button
        title="Add"
        onPress={() => {
          const trimmedValue = addValue.trim();
          const validationResult = validateNewItemName(
            trimmedValue,
            getAddedItems()
          );
          if (validationResult !== "") {
            setError(validationResult);
            return;
          }
          setError("");
          createQuestion(trimmedValue);
          setShowAddOptionDialog(false);
          setShowOptionsDialog(false);
          setAddValue("");
        }}
      />
    </>
  );
};

const validateNewItemName = (newItemName: string, picklist: string[]) => {
  if (newItemName === "") {
    return "Please enter a name for the new question";
  }
  if (picklist.includes(newItemName)) {
    return "This question already exists, select from the list";
  }
  return "";
};
const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default GeneralQuestionPrompt;
