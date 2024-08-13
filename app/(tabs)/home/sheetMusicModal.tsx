import { View, Text } from "react-native";
import React, { useState } from "react";
// Note that in order for this modal to update with the current video's pdf info
//we will have to keep track of the current video being play's information
//once we know the current video being played info, this modal will have to go into the
//database and grab the associated pdf file to display the sheet music

//IMPORTANT
// Allow users to upload pdf, png, or heic files so that they can upload pictures of
//handwritten sheet music. This helps to lower the barrier to entry for the app

export default function sheetMusicModal() {
  const [text, setText] = useState<String>();
  const test_get = async () => {
    try {
      const response = await fetch("http://localhost:8080/notes/5");
      if (response.ok) {
        const res = await response.json();
        setText(res.title);
      }
    } catch (error) {
      console.log(error);
    }
  };
  test_get();

  return (
    <View>
      <Text>sheetMusicModal</Text>
      <Text>{text}</Text>
    </View>
  );
}
