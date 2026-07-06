# J.A.R.V.I.S - Autonomous Agentic AI & RAG Knowledge Base

This project contains submissions for **Task 5: Build an Agentic AI Application** and **Task 6: Add a RAG Application**.
J.A.R.V.I.S has been upgraded into a comprehensive workspace featuring an autonomous ReAct AI agent and a knowledge-grounded Retrieval-Augmented Generation (RAG) system.

## What This Project Does

J.A.R.V.I.S now features two main modes:
1. **Agentic Mode (Task 5):** An autonomous Research and Calculation Assistant using a ReAct reasoning loop to search the web, read articles, calculate math, and compile findings into downloadable PDF reports.
2. **RAG Knowledge Base (Task 6):** A document-grounded chatbot allowing users to upload documents (PDF, DOCX, TXT, MD, CSV) and query them. It retrieves context semantically, highlights retrieved sources, handles query expansions, and generates citation-grounded answers.
3. *(Legacy features like Standard Chat, A/B Testing, and Image Generation are still available in the sidebar!)*


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

## RAG Architecture and Pipeline

The RAG application is fully modularized and integrated within the Streamlit workspace (`rag_backend.py` and `JARVIS.py`):

1. **Document Ingestion (Multi-Format Parser):**
   - **PDF:** Uses `pypdf` to extract text page-by-page. Pages are tracked individually so the citation system can reference page numbers (e.g., `[Document.pdf, Page 3]`).
   - **DOCX:** Uses `python-docx` to read paragraphs and structure cells inside Word document tables.
   - **CSV:** Uses Python's standard `csv` library to parse rows and represent tabular data as descriptive, queryable strings.
   - **TXT/MD:** Standard UTF-8 decoding and file parsing.
2. **Text Splitter (Chunker):**
   - Implements a sliding-window character text splitter that maintains word boundaries, dividing documents into 800-character blocks with a 150-character overlap.
3. **Embedding Model:**
   - Leverages **Gemini's `models/gemini-embedding-001`** embedding model via the `google-generativeai` package to transform chunks and queries into 3072-dimensional semantic vectors.
4. **Vector Database:**
   - A persistent, file-backed **SQLite** database stores the document metadata (`documents` table) and chunk records (`chunks` table) alongside JSON-serialized embedding arrays.
   - Vector similarity search computes the Cosine Similarity mathematically inside the application using **NumPy** for sub-millisecond execution over hundreds of chunks without relying on heavy external vector database binaries.
5. **Grounded Generation and Citations:**
   - Generates responses grounded in the retrieved chunks. The assistant presents clear inline citations and a dedicated expander showing the matching text chunks and their exact cosine similarity percentage.

## RAG Features (Creative Additions)

- **Query Expansion:** If enabled, the application uses the LLM to generate alternative search terms prior to semantic lookup, improving recall.
- **Database Auto-Summary:** Analyzes snippets from the active database to generate a comprehensive topic summary of the entire knowledge base.
- **Multi-Document Selector:** Multi-select widget to restrict queries to specific uploaded files, or search across the entire database.
- **Similarity Score Threshold:** Adjusts the minimum cosine similarity needed to retrieve document chunks.

## How to Run It Locally

1. **Clone the repository** and navigate to the project directory.
2. **Re-create and Activate the Virtual Environment (Python 3.12 Recommended):**
   ```bash
   python3 -m venv --clear .venv
   .venv/bin/pip install -r requirements.txt
   ```
3. **Run the Streamlit application:**
   ```bash
   .venv/bin/streamlit run JARVIS.py
   ```

## How to Add Your API Keys

J.A.R.V.I.S uses environment variables to ensure no API keys are hardcoded.
1. Copy the `.env.example` file to `.env` if not already present.
2. Fill in the keys (e.g., `GEMINI_API_KEY`, `GROQ_API_KEY`, `HUGGINGFACE_API_KEY`).

