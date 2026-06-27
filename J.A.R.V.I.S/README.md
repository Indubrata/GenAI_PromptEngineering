# J.A.R.V.I.S - Autonomous Agentic AI

This project is a comprehensive submission for **Task 5: Build an Agentic AI Application**. 
J.A.R.V.I.S has been upgraded from a standard multimodal chatbot into a fully autonomous Agentic AI that can reason, use tools, maintain memory, and perform multi-step workflows to solve real-world problems.

## What This Project Does

J.A.R.V.I.S now features a powerful **Agentic Mode**, acting as an autonomous Research and Calculation Assistant. It goes far beyond the typical "Prompt -> Response" chatbot paradigm. When asked a complex question, the AI plans its approach, autonomously executes tools, gathers observations, and synthesizes a final answer.

Key capabilities include:
- **Autonomous Tool Usage:** Can search the web, read articles, and calculate complex math.
- **Reasoning Loop:** Uses a custom multi-step ReAct (Reasoning and Acting) architecture.
- **Detailed PDF Reports:** If requested (by including the word "report" in your prompt), the Agent can compile its findings into a beautifully formatted, downloadable PDF research report.
- *(Legacy features like Standard Chat, A/B Testing, and Image Generation are still available in the sidebar!)*

## Agent Workflow (ReAct Architecture)

The core of J.A.R.V.I.S's autonomy is built on a custom **ReAct (Reasoning and Acting)** loop implemented from scratch in `agent.py`:
1. **User Query:** The user inputs a complex prompt.
2. **Thought Process:** The LLM analyzes the prompt and outputs a `Thought` explaining what it needs to do.
3. **Tool Selection:** The LLM outputs an `Action` (the tool to use) and `Action Input`.
4. **Execution:** The backend Python script parses this, safely executes the requested tool, and returns the result as an `Observation` back to the LLM.
5. **Synthesis:** This loop repeats autonomously until the LLM has enough information to formulate a `Final Answer`.
6. **UI Integration:** The entire thought and execution process is streamed live to the Streamlit frontend so the user can watch the Agent's reasoning step-by-step.

## Tools Used

The Agent is equipped with three robust tools (`tools.py`) that are critical for solving real-world research and analytical problems:
1. **`search_web(query)`**: Uses `duckduckgo-search` to query the live internet for up-to-date information that the LLM doesn't have in its base training data.
2. **`fetch_webpage(url)`**: Uses `requests` and `beautifulsoup4` to visit URLs and scrape full text content, allowing the agent to deeply read articles rather than relying purely on search snippets.
3. **`calculate(expression)`**: Uses the advanced `sympy` computer algebra system to safely and accurately compute complex math, algebra, derivatives, and integrals, ensuring no LLM arithmetic hallucinations. The agent explicitly explains the intermediate steps in plain English.

## Memory Implementation

Memory is maintained across interactions to provide a seamless conversational experience:
- **Session State:** Chat history is stored persistently in Streamlit's `st.session_state.messages`.
- **Context Injection:** On every turn of the Agent's ReAct loop, the full conversation history is injected into the LLM's system context. This allows the Agent to remember previous findings, refer back to user constraints, and build upon prior tool observations across multiple turns without losing context.

## How to Run It Locally

1. **Clone the repository** and navigate to the project directory.
2. **Install the required dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the Streamlit application**:
   ```bash
   streamlit run JARVIS.py
   ```

## How to Add Your API Keys

J.A.R.V.I.S uses environment variables to ensure no API keys are hardcoded.
1. Locate the `.env.example` file and copy it to a new file named `.env`.
2. Open the `.env` file and fill in your keys (e.g., `GEMINI_API_KEY`, `GROQ_API_KEY`, `HUGGINGFACE_API_KEY`). The app adapts to whichever keys are present!
