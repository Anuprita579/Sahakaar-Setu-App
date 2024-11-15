import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { MotiView } from "moti"; // For animations
// import "nativewind";

const news = [
    {
      ministryName: "Minister of Housing and Urban Affairs",
      newsTitle: "Boosting India's infrastructure",
      hashtags: [
        { id: "001", label: "CentralVistaProject " },
        { id: "002", label: "IndiaOnTheRise" },
        { id: "003", label: "IndiaOnTheRise" },
      ],
      desc: "Union Minister @mlkhattar reviewed the progress of Central Vista project. He commended the team and expressed satisfaction with speed & quality! 🚧 🙌A brighter future is taking shape!",
      newsDate: "15 Aug 2024",
      newsSource: "X",
    },
    {
      ministryName: "Minister of Housing and Urban Affairs",
      newsTitle: "Boosting India's infrastructure",
      hashtags: [
        { id: "001", label: "CentralVistaProject " },
        { id: "002", label: "IndiaOnTheRise" },
        { id: "003", label: "IndiaOnTheRise" },
      ],
      desc: "Union Minister @mlkhattar reviewed the progress of Central Vista project. He commended the team and expressed satisfaction with speed & quality! 🚧 🙌A brighter future is taking shape!",
      newsDate: "15 Aug 2024",
      newsSource: "X",
    },
    {
      ministryName: "Minister of Housing and Urban Affairs",
      newsTitle: "Boosting India's infrastructure",
      hashtags: [
        { id: "001", label: "CentralVistaProject " },
        { id: "002", label: "IndiaOnTheRise" },
        { id: "003", label: "IndiaOnTheRise" },
      ],
      desc: "Union Minister @mlkhattar reviewed the progress of Central Vista project. He commended the team and expressed satisfaction with speed & quality! 🚧 🙌A brighter future is taking shape!",
      newsDate: "15 Aug 2024",
      newsSource: "X",
    },
  ];
  
const NewsCard = ({
  ministryName,
  newsTitle,
  hashtags,
  newsSource,
  desc,
  newsDate,
  newsImage,
}) => {
  const defaultImageURL =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPZU58UuWue5MRwUfeTtOvf8YijLeQ1vQQHzrKi8-zw15ATdTzFZq3imIBHlFNfOzQ6Tr8hhk&s=10";

  const backgroundImageUrl = newsImage || defaultImageURL;

  return (
    <View horizontal={true} className="bg-slate-100 border border-gray-200 rounded-lg shadow-lg w-72 p-4 m-2">
      <Image
        source={{ uri: backgroundImageUrl }}
        className="h-40 w-full rounded-lg"
      />
      <Text className="italic text-gray-500 font-semibold mt-2">
        {ministryName}
      </Text>
      <Text className="font-bold text-black mt-1">{newsTitle}</Text>
      <Text className="text-gray-600 text-sm mt-2">{desc}</Text>
      <View className="flex flex-wrap mt-2">
        {hashtags.map((tag, index) => (
          <Text key={index} className="text-blue-500">
            #{tag.label}
          </Text>
        ))}
      </View>
      <View className="flex flex-row justify-between mt-4">
        <Text className="text-gray-400 text-xs">Posted on {newsSource}</Text>
        <Text className="text-gray-400 text-xs">{newsDate}</Text>
      </View>
    </View>
  );
};

const News = () => {
  return (
    <ScrollView
      // style={{ alignItems: "center" }}
      className="flex flex-wrap p-4"
      horizontal={true}
    >
      {news.map((item, index) => (
        <MotiView
          key={index}
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: 500,
            delay: index * 200,
          }}
        >
          <NewsCard
            ministryName={item.ministryName}
            hashtags={item.hashtags}
            desc={item.desc}
            newsTitle={item.newsTitle}
            newsImage={item.newsImage}
            newsDate={item.newsDate}
            newsSource={item.newsSource}
          />
        </MotiView>
      ))}
    </ScrollView>
  );
};

export default News;
