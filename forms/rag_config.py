from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import PyPDFLoader, PyPDFDirectoryLoader
from langchain.text_splitter import CharacterTextSplitter,TokenTextSplitter
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from django.conf import settings
import os
import logging


logger=logging.getLogger(__name__)
    
class RAG:
    def __init__(self) -> None:
        
        # Use settings instead of env variables directly
        self.pdf_folder_path = os.path.join(settings.BASE_DIR, settings.SOURCE_DATA.lstrip('/'))
        self.vector_store_path = os.path.join(settings.BASE_DIR, settings.VECTOR_STORE.lstrip('/'))
        self.emb_model_path = settings.EMBED_MODEL
        self.emb_model = self.get_embedding_model(self.emb_model_path)
       
        
        # Create directories if they don't exist
        os.makedirs(self.pdf_folder_path, exist_ok=True)
        os.makedirs(self.vector_store_path, exist_ok=True)
        
        logger.info(f"Initializing RAG with PDF path: {self.pdf_folder_path}")
        logger.info(f"Vector store path: {self.vector_store_path}")
        
        try:
            self.emb_model = self.get_embedding_model(self.emb_model_path)
        except Exception as e:
            logger.error(f"Failed to initialize embedding model: {e}")
            raise

    def load_docs(self,path:str) -> PyPDFDirectoryLoader:
        loader = PyPDFDirectoryLoader(path)
        docs = loader.load()
        if docs is not None:
            print(f"Loaded {len(docs)} documents from {path}")
        else:
            print(f"No documents found in {path}")
            docs = []
        return docs
    
    def get_embedding_model(self,emb_model) -> HuggingFaceBgeEmbeddings :
        model_kwargs = {'device': 'cpu'}
        encode_kwargs = {'normalize_embeddings': True} # set True to compute cosine similarity
        embeddings_model = HuggingFaceBgeEmbeddings(
            model_name=emb_model,
            model_kwargs=model_kwargs,
            encode_kwargs=encode_kwargs,
        )
        return embeddings_model
    
    def split_docs(self,docs)-> TokenTextSplitter:
        text_splitter = TokenTextSplitter(chunk_size=500, chunk_overlap=0)
        documents = text_splitter.split_documents(docs)
        return documents
    
    def populate_vector_db(self) -> None:
        # load embeddings into Chroma - need to pass docs , embedding function and path of the db

        self.doc = self.load_docs(self.pdf_folder_path)
        self.documents = self.split_docs(self.doc)
        
        db = Chroma.from_documents(self.documents,
                                   embedding=self.emb_model,
                                   persist_directory=self.vector_store_path)
        
        db.persist()
    
    def load_vector_db(self)-> Chroma:
        #to load back the embeddings from disk 
        db = Chroma(persist_directory=self.vector_store_path,embedding_function=self.emb_model)
        return db
    
    def get_retriever(self) -> Chroma:
        return self.load_vector_db().as_retriever()

