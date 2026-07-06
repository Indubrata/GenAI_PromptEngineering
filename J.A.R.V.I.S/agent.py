import markdown
from xhtml2pdf import pisa
import io
from tools import AVAILABLE_TOOLS

AGENT_SYSTEM_PROMPT = """You are an autonomous AI Agent equipped with tools.
You have access to the following tools:
- search_web(query): Searches the web for a query and returns top results.
- fetch_webpage(url): Fetches the text content of a webpage.
- calculate(expression): Evaluates a mathematical expression safely using SymPy.

IMPORTANT FOR MATH: If asked a mathematical question, you MUST follow this format in your Final Answer:
1. FIRST, state the final answer clearly in **bold** at the very top.
2. THEN, write out and explain every intermediate step clearly in plain English.
Do NOT use computer-like syntax (like 'x**2' or 'integrate') AND DO NOT use LaTeX syntax (like '\\frac' or '\\int'). Always use plain English text (like 'x^3 / 3 + C'). You can use the calculate tool to verify intermediate steps or find the final answer.

You must follow a strict format. You can either use a tool OR provide a final answer.

To use a tool, output exactly:
Thought: <explain why you need the tool>
Action: <tool_name>
Action Input: <input string>

To provide the final answer, output exactly:
Thought: <explain why you are ready to answer>
Final Answer: <your full answer to the user>

Do not include both an Action and a Final Answer in the same response.
"""

class Agent:
    def __init__(self, llm_handler, model_name):
        self.llm_handler = llm_handler
        self.model_name = model_name
        
    def run(self, user_prompt, chat_history, max_steps=7):
        # Build prompt for this run
        history_text = "\n".join([f"{msg['role'].capitalize()}: {msg['content']}" for msg in chat_history])
        current_context = f"Chat History:\n{history_text}\n\nUser: {user_prompt}\n"
        
        step = 0
        while step < max_steps:
            step += 1
            
            # Ask LLM
            full_response = ""
            for chunk in self.llm_handler.generate_response_stream(
                self.model_name, 
                current_context + "\nWhat is your next step?", 
                AGENT_SYSTEM_PROMPT, 
                [] # We handle history manually in context
            ):
                full_response += chunk
            
            # Parse response
            if "Final Answer:" in full_response:
                try:
                    thought = full_response.split("Final Answer:")[0].replace("Thought:", "").strip()
                    final_answer = full_response.split("Final Answer:")[1].strip()
                except:
                    thought = "Formulating final answer..."
                    final_answer = full_response
                yield {"type": "final_answer", "thought": thought, "content": final_answer}
                break
                
            elif "Action:" in full_response and "Action Input:" in full_response:
                try:
                    thought = full_response.split("Action:")[0].replace("Thought:", "").strip()
                    action_part = full_response.split("Action:")[1]
                    action = action_part.split("Action Input:")[0].strip()
                    action_input = action_part.split("Action Input:")[1].strip()
                    
                    yield {"type": "tool_call", "thought": thought, "action": action, "action_input": action_input}
                    
                    # Execute Tool
                    if action in AVAILABLE_TOOLS:
                        result = AVAILABLE_TOOLS[action](action_input)
                    else:
                        result = f"Error: Tool '{action}' not found."
                        
                    yield {"type": "tool_result", "content": result}
                    
                    # Append to context
                    current_context += f"\n{full_response}\nObservation: {result}\n"
                except Exception as e:
                    yield {"type": "error", "content": f"Failed to parse action: {str(e)}"}
                    break
            else:
                # Malformed output, treat as final answer
                yield {"type": "final_answer", "thought": "I generated a response that didn't follow the tool format.", "content": full_response}
                break
        
        if step >= max_steps:
            yield {"type": "error", "content": "Agent reached maximum steps without a final answer."}

    def generate_pdf_report(self, findings_text):
        """Generates a detailed research report PDF based on findings."""
        prompt = f"Based on the following conversation and findings, write a highly detailed, well-structured, professional research report in Markdown format. Include a title, executive summary, main findings, and conclusion.\n\nContext:\n{findings_text}"
        
        full_response = ""
        for chunk in self.llm_handler.generate_response_stream(
            self.model_name, 
            prompt, 
            "You are an expert research analyst writing detailed reports.", 
            []
        ):
            full_response += chunk
            
        # Convert Markdown to HTML then to PDF
        html = markdown.markdown(full_response, extensions=['tables'])
        
        # Clean up text to prevent black boxes in xhtml2pdf due to unsupported unicode characters
        html = html.replace('\u2013', '-') # en dash
        html = html.replace('\u2014', '--') # em dash
        html = html.replace('\u2011', '-') # non-breaking hyphen
        html = html.replace('\u00ad', '-') # soft hyphen
        html = html.replace('\u2018', "'").replace('\u2019', "'") # single quotes
        html = html.replace('\u201c', '"').replace('\u201d', '"') # double quotes
        html = html.replace('\u00a0', ' ') # non-breaking space
        styled_html = f"""
        <html>
        <head>
        <style>
            body {{ font-family: Helvetica, Arial, sans-serif; font-size: 12px; color: #333; }}
            h1 {{ color: #005f73; border-bottom: 1px solid #ccc; padding-bottom: 5px; }}
            h2 {{ color: #0a9396; }}
            h3 {{ color: #001219; }}
            p {{ line-height: 1.5; }}
            li {{ margin-bottom: 5px; }}
            table {{ width: 100%; border-collapse: collapse; margin-bottom: 10px; }}
            th, td {{ border: 1px solid #ddd; padding: 6px; text-align: left; }}
            th {{ background-color: #f2f2f2; color: #005f73; }}
        </style>
        </head>
        <body>
        {html}
        </body>
        </html>
        """
        
        result_file = io.BytesIO()
        pisa_status = pisa.CreatePDF(io.StringIO(styled_html), dest=result_file)
        
        if pisa_status.err:
            return None, "Error generating PDF"
            
        return result_file.getvalue(), full_response
