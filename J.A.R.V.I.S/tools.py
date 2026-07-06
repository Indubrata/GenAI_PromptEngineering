import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS
import sympy

def search_web(query: str, max_results: int = 5) -> str:
    """Searches the web for a query and returns top results."""
    try:
        results = []
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=max_results):
                results.append(f"Title: {r.get('title')}\nURL: {r.get('href')}\nSnippet: {r.get('body')}\n")
        if not results:
            return "No results found."
        return "\n---\n".join(results)
    except Exception as e:
        return f"Error performing web search: {str(e)}"

def fetch_webpage(url: str) -> str:
    """Fetches the text content of a webpage."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.extract()
            
        text = soup.get_text(separator=' ', strip=True)
        # Limit length to avoid overwhelming context
        if len(text) > 8000:
            text = text[:8000] + "\n...[Content Truncated]..."
        return text
    except Exception as e:
        return f"Error fetching webpage: {str(e)}"

def calculate(expression: str) -> str:
    """
    Evaluates a mathematical expression safely using SymPy.
    Supports basic arithmetic, algebra, calculus (diff, integrate), and more.
    """
    try:
        x, y, z = sympy.symbols('x y z')
        expr = sympy.sympify(expression, locals={'x': x, 'y': y, 'z': z})
        if hasattr(expr, 'doit'):
            expr = expr.doit()
        return str(expr)
    except Exception as e:
        return f"Error calculating expression: {str(e)}. Note: use correct Python syntax (e.g., 'x**2' for exponents)."

AVAILABLE_TOOLS = {
    "search_web": search_web,
    "fetch_webpage": fetch_webpage,
    "calculate": calculate
}
