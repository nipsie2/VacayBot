import copy
from fastapi import FastAPI, HTTPException
from llama_cpp import Llama
from pydantic import BaseModel

# loading model
print("loading model...")
llm = Llama(model_path=r"C:\Users\johnh\PycharmProjects\pythonProject1\models\llama-2-7b-chat.Q2_K.gguf")
print("model loaded!")

app = FastAPI()

class InputMessage(BaseModel):
    message: str

class OutputMessage(BaseModel):
    response: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the chatbot API!"}

@app.get("/chat", response_model=OutputMessage)
def chat_get():
    return {"response": "This is a GET request. Please use POST for chatting."}

@app.post("/chat", response_model=OutputMessage)
def chat_post(input_message: InputMessage):
    try:
        global llm
        if llm is None:
            raise HTTPException(status_code=500, detail="Chatbot model not loaded")

        user_message = input_message.message

        # Use your chatbot model to generate a response
        bot_response_dict = llm(user_message,
                                max_tokens=-1,
                                echo=False,
                                temperature=0.1,
                                top_p=0.9)

        # Extract relevant information and construct a string
        bot_response = bot_response_dict.get('response', 'Default response')

        return OutputMessage(response=bot_response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
