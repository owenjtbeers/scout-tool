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
import type { Alias } from "../../../redux/scouting/types";
import { set } from "react-hook-form";
import { ViewComponent } from "react-native";
interface GeneralQuestionPromptProps {
  type: "Weed" | "Pest" | "Disease";
  picklist: Alias[];
  isLoadingPicklist: boolean;
  getAddedAliases: () => Alias[];
  recentlyObserved: Map<string, number>;
  createQuestion: (alias: Alias) => void;
}

const GeneralQuestionPrompt = (props: GeneralQuestionPromptProps) => {
  const {
    type,
    picklist,
    createQuestion,
    getAddedAliases,
    isLoadingPicklist,
    recentlyObserved,
  } = props;
  const { theme } = useTheme();
  const [itemsAdded, setItemsAdded] = useState<Alias[]>([]);
  const [newItemsAdded, setNewItemsAdded] = useState(false);
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const [showAddOptionDialog, setShowAddOptionDialog] = useState(false);
  const [addValue, setAddValue] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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
        {showOptionsDialog && (
          <Dialog
            isVisible={showOptionsDialog}
            onDismiss={handleOptionsDialogClose}
          >
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
            {/* TODO: Style this bar globally */}
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
                  <ListItem
                    key={alias.Name + index}
                    onPress={handleItemPress(alias)}
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
              title={newItemsAdded ? "Add new weed(s)" : "Close"}
              onPress={handleOptionsDialogClose}
            />
          </Dialog>
        )}
        {showAddOptionDialog && (
          <Dialog
            isVisible={showAddOptionDialog}
            onDismiss={handleAddOptionDialogClose}
          >
            <Dialog.Title title={`Add ${type}`} />
            <Input
              label={`${type} Name`}
              placeholder={`New ${type} Name`}
              onChangeText={setAddValue}
              value={addValue}
            />
            <Button
              title="Add"
              onPress={() => {
                createQuestion({ ID: 0, Name: addValue });
                setShowAddOptionDialog(false);
                setShowOptionsDialog(false);
                setAddValue("");
              }}
            />
          </Dialog>
        )}
      </ListItem.Accordion>
    </View>
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

export default GeneralQuestionPrompt;
