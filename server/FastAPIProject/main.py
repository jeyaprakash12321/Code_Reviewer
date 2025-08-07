from fastapi import FastAPI, Query
from dotenv import load_dotenv
from git import Repo
import os, tempfile, requests
from openai import AzureOpenAI
from fastapi.middleware.cors import CORSMiddleware
import json


load_dotenv()

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

@app.get("/")
async def root():
    try:
        response = client.chat.completions.create(
            model="gpt-35-turbo",
            messages=[
                {"role": "system", "content": "You are a code review assistant."},
                {"role": "user", "content": "Review my code and give comments."}
            ],
        )
        return {"review": response.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}


@app.post("/review-repo")
async def review_repo(repo_url: str = Query(..., description="GitHub repo URL")):
    temp_dir = tempfile.mkdtemp()
    Repo.clone_from(repo_url, temp_dir)  # ✅ Use dynamic repo_url

    reviews = []
    prompt = f""" 
            Respond with a valid **JSON array of objects only**, without any Markdown formatting or extra text.

            Each object must have:
            - id : A unique identifier like fw42-23235-235325fs it should not match with any other id always should be unique
            - filename: string (should be exact filename like src/pages/server.js entire path with corresponding folders should come)
            - lineNo: number
            - issueName: string
            - issueType: string (Security, Performance, Bug, Best Practice)
            - severity: string (Low, Medium, High, Critical)
            - description: string (explain the issue detailed description)
            - fix: how to fix it and give code snippet also

            Rules:
            - Do NOT wrap the output in ```json or \ or any code block.
            - Do NOT include explanations outside the JSON.
            - Do Not include \n in response anywhere 
            - Should be like JS object
            - id should be always unique
            - Should not contain duplicate values
            """
    for root, _, files in os.walk(temp_dir):
        for file in files:
            if ".git" in root or "node_modules" in root or "venv" in root:
                continue
            if file.endswith((".py", ".js", ".jsx", ".ts", ".tsx", ".env", ".json", ".css")):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    code = f.read()

                    # ✅ Truncate to avoid token overflow
                    max_chars = 5000
                    code = code[:max_chars]

                    response = client.chat.completions.create(
                        model="gpt-35-turbo",
                        messages=[
                            {"role": "system", "content": "You are a code review assistant."},
                            {"role": "user", "content": f"Analyze the following code and identify potential issues \n\n{code} :\n\n{code}" + prompt}
                        ]
                    )

                    content = response.choices[0].message.content.strip()

                    try:
                        # Parse the JSON string from the model
                        issues = json.loads(content)

                        # Ensure it's a list, so we can extend the main reviews list
                        if isinstance(issues, list):
                            reviews.extend(issues)
                        elif isinstance(issues, dict):
                            reviews.append(issues)
                    except json.JSONDecodeError:
                        print("Invalid JSON from model:", content)

    return { "reviews": reviews}

@app.post("/review-file")
async def review_file(file_url: str = Query(..., description="GitHub file URL")):
    raw_url = file_url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")
    code = requests.get(raw_url).text[:5000]  # Truncate for safety

    prompt = f"""Analyze the following code and identify potential issues.:\n\n{code} 

            
        Respond with a valid **JSON array of objects only**, without any Markdown formatting or extra text.
        
        Each object must have:
        - filename: string
        - line_no: number
        - issue_name: string
        - issue_type: string (Security, Performance, Bug, Style, Best Practice)
        - severity: string (Low, Medium, High, Critical)
        - description: string (explain the issue)
        - fix: string (how to fix it) above code snippet also
        
        Rules:
        - Do NOT wrap the output in ```json or \ or any code block.
        - Do NOT include explanations outside the JSON.
        - Return a **valid JSON array** that can be parsed directly.
        """


    response = client.chat.completions.create(
        model="gpt-35-turbo",
        messages=[
            {"role": "system", "content": "You are a strict experienced and detailed code review assistant."},
            {"role": "user", "content": prompt}
        ]
    )
    return {"file": file_url, "review": response.choices[0].message.content}

@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}
