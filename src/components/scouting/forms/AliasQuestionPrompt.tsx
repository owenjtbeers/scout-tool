import React, { useState } from "react";
import {
  Button,
  Text,
  Dialog,
  ListItem,
  SearchBar,
  ButtonGroup,
  Input,
} from "@rneui/themed";
import {
  View,
  StyleSheet,
  GestureResponderEvent,
  ActivityIndicator,
} from "react-native";
import { scoutFormStyles } from "./styles";
import { globalStyles } from "../../../constants/styles";
import { useTheme } from "@rneui/themed";
import type {
  Alias,
  ObservationTypePrefix,
} from "../../../redux/scouting/types";
import { ErrorMessage } from "../../../forms/components/ErrorMessage";

interface GeneralQuestionPromptProps {
  type: ObservationTypePrefix;
  picklist: Alias[];
  isLoadingPicklist: boolean;
  getAddedAliases: () => Alias[];
  recentlyObserved: Map<string, number>;
  createQuestion: (alias: Alias|string) => void;
}

export const AliasQuestionPrompt = (props: GeneralQuestionPromptProps) => {
  const {
    type,
    picklist,
    createQuestion,
    getAddedAliases,
    isLoadingPicklist,
    recentlyObserved,
  } = props;
  const [itemsAdded, setItemsAdded] = useState<Alias[]>([]);
  const [newItemsAdded, setNewItemsAdded] = useState(false);
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const [showAddOptionDialog, setShowAddOptionDialog] = useState(false);
  const [addValue, setAddValue] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [error, setError] = useState("");

  const handleItemPress = (item: Alias) => (event: GestureResponderEvent) => {
    if (itemsAdded.includes(item)) {
      setItemsAdded(itemsAdded.filter((i) => i !== item));
    } else {
      const addedAliases = getAddedAliases();
      if (!addedAliases.map((alias) => alias.Name).includes(item.Name)) {
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

    itemsAdded.forEach((alias) => {
      const addedAliases = getAddedAliases();
      if (!addedAliases.map((alias) => alias.Name).includes(alias.Name)) {
        createQuestion(alias);
      }
    });
    setIsAnswered(true);
    setNewItemsAdded(false);
    setItemsAdded([]);
    setSearchValue("");
  };

  const handleAddOptionDialogClose = () => {
    setShowAddOptionDialog(false);
  };

  // Set the items clicked to the added aliases
  React.useEffect(() => {
    const addedAliases = getAddedAliases();
    if (addedAliases.length > 0) {
      setItemsAdded(addedAliases);
      setIsAnswered(true);
    }
  }, []);
  return (
    <View style={scoutFormStyles.section}>
      <ListItem.Accordion
        isExpanded={!isAnswered}
        onPress={() => setIsAnswered(!isAnswered)}
        content={
          <View style={{ display: "flex", flex: 1, backgroundColor: "white" }}>
            <Text style={globalStyles.centerText}>{`Is there${
              getAddedAliases().length ? " more" : ""
            } ${type}s?`}</Text>
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
              picklist={picklist}
              isLoadingPicklist={isLoadingPicklist}
              getAddedAliases={getAddedAliases}
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
              getAddedAliases={getAddedAliases}
              picklist={picklist}
            />
          )}
        </Dialog>
      </ListItem.Accordion>
    </View>
  );
};

interface OptionsPicklistProps {
  type: ObservationTypePrefix;
  picklist: Alias[];
  isLoadingPicklist: boolean;
  getAddedAliases: () => Alias[];
  recentlyObserved: Map<string, number>;
  setShowAddOptionDialog: (show: boolean) => void;
  setAddValue: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  itemsAdded: Alias[];
  setItemsAdded: (value: Alias[]) => void;
  newItemsAdded: boolean;
  setNewItemsAdded: (value: boolean) => void;
  setShowOptionsDialog: (show: boolean) => void;
  showOptionsDialog: boolean;
  handleItemPress: (item: Alias) => (event: GestureResponderEvent) => void;
  handleOptionsDialogClose: () => void;
}
export const OptionsPicklist = (props: OptionsPicklistProps) => {
  const {
    type,
    isLoadingPicklist,
    picklist,
    getAddedAliases,
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
          .filter(([alias]) => alias.includes(searchValue))
          .sort((a, b) => a[1] - b[1])
          .map(([alias, count]) => (
            <ListItem
              key={alias}
              // TODO: This needs to have the correct ID
              onPress={handleItemPress({ ID: 0, Name: alias })}
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
                    !!itemsAdded.find(
                      (clickedAlias) => alias === clickedAlias.Name
                    ) || !!getAddedAliases().find((a) => a.Name === alias)
                  }
                  // onPress={handleItemPress(question)}
                />
                <Text>{alias}</Text>
                <Text>{`  ${count} times`}</Text>
              </View>
            </ListItem>
          ))}

      {picklist && picklist.length > 0 && (
        <ListItem bottomDivider>
          <Text>Organization List</Text>
        </ListItem>
      )}
      {isLoadingPicklist ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        // TODO: Make this search through potential scientific values as well
        picklist
          ?.filter((alias) => alias.Name.includes(searchValue))
          .map((alias, index) => (
            <ListItem key={alias.Name + index} onPress={handleItemPress(alias)}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <ListItem.CheckBox
                  checked={
                    !!itemsAdded.find(
                      (clickedAlias) => alias.Name === clickedAlias.Name
                    )
                  }
                  // onPress={handleItemPress(question)}
                />
                <Text>{alias.Name}</Text>
              </View>
            </ListItem>
          ))
      )}
      <Button
        title={newItemsAdded ? `Add new ${type}(s)` : "Close"}
        onPress={handleOptionsDialogClose}
      />
    </>
  );
};

interface AddOptionMenuProps {
  type: ObservationTypePrefix;
  error: string;
  addValue: string;
  setAddValue: (value: string) => void;
  setError: (value: string) => void;
  setShowAddOptionDialog: (show: boolean) => void;
  setShowOptionsDialog: (show: boolean) => void;
  createQuestion: (alias: Alias|string) => void;
  getAddedAliases: () => Alias[];
  picklist: Alias[];
}
export const AddOptionMenu = (props: AddOptionMenuProps) => {
  const {
    type,
    error,
    addValue,
    setAddValue,
    setError,
    setShowAddOptionDialog,
    setShowOptionsDialog,
    createQuestion,
    picklist,
    getAddedAliases,
  } = props;
  return (
    <>
      <Dialog.Title title={`Add ${type}`} />
      {error !== "" && <ErrorMessage message={error} />}
      <Input
        label={`${type} Name`}
        placeholder={`New ${type} Name`}
        onChangeText={setAddValue}
        value={addValue}
      />
      <Button
        title="Add"
        onPress={() => {
          const trimmedValue = addValue.trim();
          const validationResult = validateNewAliasName(trimmedValue, [
            ...picklist,
            ...getAddedAliases(),
          ]);
          if (validationResult !== "") {
            setError(validationResult);
            return;
          }
          setError("");
          createQuestion({ ID: 0, Name: trimmedValue });
          setShowAddOptionDialog(false);
          setShowOptionsDialog(false);
          setAddValue("");
        }}
      />
    </>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

const validateNewAliasName = (newAliasName: string, addedAliases: Alias[]) => {
  if (newAliasName === "") {
    return "Please enter a value";
  }
  if (addedAliases.find((alias) => alias.Name.trim() === newAliasName)) {
    return "This value already exists. Please enter a new value.";
  }
  return "";
};

export default AliasQuestionPrompt;
