import {
  View,
  Text,
  Modal,
  SafeAreaView,
  Pressable,
  GestureResponderEvent,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Router, useGlobalSearchParams } from "expo-router";

type Props = {
  isVisible?: boolean | undefined;
};
export default function Comments({ isVisible }: Props) {
  //const { currentPostID } = useGlobalSearchParams<{ currentPostID: string }>();
  const params = useGlobalSearchParams<{ currentPostID: string }>();
  const [visible, setVisible] = useState<boolean>(false);
  const [commments, setComments] = useState<string | null>(null);
  const firstRender = useRef<boolean>(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      console.log("first");
      return;
    }
    setVisible(true);
  }, [isVisible]);

  useEffect(() => {
    console.log(params.currentPostID);
    setComments(params.currentPostID);
  }, [params]);
  return (
    <SafeAreaView>
      <Modal
        animationType="slide"
        presentationStyle="formSheet"
        visible={visible}
      >
        <Text>{commments}</Text>
        <Pressable
          onPress={() => {
            setVisible(false);
          }}
        >
          <Text>Close</Text>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
