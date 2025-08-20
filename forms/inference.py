from llm_config import LLM
from rag_config import RAG
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain.chains import RetrievalQA



def generate_feedback_for_categories(categories):
    """
    Generate detailed feedback for multiple categories using RAG and LLM.
    """
    rag = RAG()
    retriever = rag.get_retriever()
    llm = LLM()

    feedback_results = []

    for category in categories:
        category_name = category['category']['name']
        average = category['average']

        # Retrieve relevant documents for the category
        docs = retriever.retrieve(f"Recursos para mejorar en {category_name}")
        doc_links = "\n".join([f"- {doc.metadata['title']}: {doc.metadata['url']}" for doc in docs])

        # Generate feedback using LLM
        feedback = llm.complete(
            system_prompt="Eres un asistente útil.",
            user_prompt=f"Proporciona retroalimentación para un usuario con puntaje {average} en {category_name}.",
        )

        feedback_results.append({
            'category': category_name,
            'average': average,
            'feedback': feedback,
            'resources': doc_links
        })

    return feedback_results

def predict_rag(qns:str,history=None)->str:
    
    llm = LLM().complete()
    retriever = RAG().get_retriever()
    template = """Answer the question based only on the following context:
    {context}

    Question: {question}
    """
    prompt = ChatPromptTemplate.from_template(template)

    retrieval_chain = (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
        )
    result = retrieval_chain.invoke(qns)
    return result