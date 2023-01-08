const OpenAI = require("openai");
const { Configuration, OpenAIApi } = OpenAI;

const express = require('express');
const cors = require('cors');

const configuration = new Configuration({
    organization: "org-j7SGVrKIxMo7ymkkfrBxuEgF",
    apiKey: "<api-key>", // Dont be smart, I have deleted the API key
});
const openai = new OpenAIApi(configuration);
const PORT = 3001;

const app = express();

app.use(cors());

async function dietPlan(userInfo, calories) {
    console.log('Request 2: Making Diet Plan...')
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `
        Create a meal plan for a ${userInfo.age} year old ${userInfo.gender}. The daily macro split is 25% carbs, 35% protein, 40% fats with no more than 50g of sugar and 28g of fibre. ${calories.Breakfast} calorie post workout breakfast with healthy fats and b vitamins. ${calories.Lunch} calorie lunch with moderate fats and vitamin D. ${calories.Dinner} calorie dinner with high carbs, low fat and magnesium. Consider foods that are low glycemic but don't avoid fruit, vegetables, and fish. Only use lean meat. Your answer should include all 3 meals (breakfast, lunch, dinner) with headings of the same and then the food in bulleted format. All these headings should include the number calories (given above) for that meal in the brackets and a colon in the end.\n`,
        max_tokens: 256,
        temperature: 0.7,
        });
    return response.data.choices[0].text;
}

app.get('/', async (req, res) => {
    console.log(req.query.object);
    const userInfo = JSON.parse(req.query.object);
    console.log("--\n", userInfo, "\n--")
    const response = await openai.createCompletion({
        model: "code-davinci-002",
        prompt: `
        The user will provide you with certain parameters regarding his body and health and you need to reply with how many calories he should eat per day in breakfast, lunch and dinner. Your answer should be formated exactly like the example (json). Don't repeat any text and reply only once with the json.

        User => I am 15 yeards old. My height is 150cm. I am a male. My activity level is around 2 hours a day. My weight is 60kg.

        You =>
        {
            "Breakfast": "600-700",
            "Lunch": "800-900",
            "Dinner": "800-900"
        }

        User => I am 30 years old. My height is 170cm. I am a female. My activity level is around 1 hours a day. My weight is 70kg.

        You =>
        {
            "Breakfast": "600-700",
            "Lunch": "700-800",
            "Dinner": "700-800"
        }


        User => I am ${userInfo.age} years old.My height is ${userInfo.height}cm. I am a ${userInfo.gender}. My activity level is around ${userInfo.activityLevel} hours a day. My weight is ${userInfo.weight}kg.

        You =>`,
        max_tokens: 200,
        temperature: 0.1,
        stop: "###",
    });

    const calories = response.data.choices[0].text;
    console.log(calories);
    Promise.resolve(dietPlan(userInfo, calories)).then((ans) => {
        res.json({
        "answer": String(ans)
    });
    })
})

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
})
