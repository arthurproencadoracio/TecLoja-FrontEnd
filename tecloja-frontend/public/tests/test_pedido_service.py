import pytest
from decimal import Decimal
from unittest.mock import AsyncMock, MagicMock
from app.exceptions import BusinessException, ResourceNotFoundException
from app.models.pedido import Cliente
from app.models.produto import Produto
from app.schemas.pedido_schema import PedidoFormSchema, ItemPedidoFormSchema
from app.services.pedido_service import PedidoService

@pytest.mark.asyncio
async def test_realizar_pedido_sucesso():
    # 1. Preparar massa de teste falsa (Mocks)
    session_mock = AsyncMock()
    
    # Mock do begin() para gerenciar a transação assíncrona
    session_mock.begin = AsyncMock()
    
    cliente_mock = Cliente(id=1, nome="Maria Silva", email="maria@gmail.com")
    produto_mock = Produto(id=10, nome="Notebook Gamer", preco=Decimal("5000.00"), estoque=5)

    # Configura o retorno do session.get() para simular o banco
    async def mock_get(model, pk):
        if model == Cliente:
            return cliente_mock
        if model == Produto:
            return produto_mock
        return None
        
    session_mock.get = AsyncMock(side_effect=mock_get)

    # Instancia DTO de entrada
    item_form = ItemPedidoFormSchema(produto_id=10, quantidade=2)
    form = PedidoFormSchema(cliente_id=1, itens=[item_form])

    # 2. Executar a lógica de serviço
    service = PedidoService(session_mock)
    resultado = await service.realizar_pedido(form)

    # 3. Asserções e Validações de Qualidade
    assert resultado is not None
    assert resultado.cliente_nome == "Maria Silva"
    assert resultado.valor_total == Decimal("10000.00") # 2 unidades x R$ 5000
    
    # Valida integridade referencial: estoque reduzido fisicamente no objeto
    assert produto_mock.estoque == 3 # 5 - 2 = 3
    
    # Garante que o flush e commit de persistência foram invocados
    assert session_mock.flush.called


@pytest.mark.asyncio
async def test_realizar_pedido_estoque_insuficiente():
    session_mock = AsyncMock()
    session_mock.begin = AsyncMock()
    
    cliente_mock = Cliente(id=1, nome="Maria Silva", email="maria@gmail.com")
    produto_mock = Produto(id=10, nome="Notebook Gamer", preco=Decimal("5000.00"), estoque=5)

    async def mock_get(model, pk):
        if model == Cliente:
            return cliente_mock
        if model == Produto:
            return produto_mock
        return None
        
    session_mock.get = AsyncMock(side_effect=mock_get)

    # Solicita 6 unidades, mas há apenas 5 em estoque
    item_form = ItemPedidoFormSchema(produto_id=10, quantidade=6)
    form = PedidoFormSchema(cliente_id=1, itens=[item_form])

    service = PedidoService(session_mock)

    # Executa e valida o lançamento de BusinessException
    with pytest.raises(BusinessException) as exc_info:
        await service.realizar_pedido(form)

    assert "Estoque insuficiente" in str(exc_info.value)
    
    # Princípio ACID: Garante que o estoque não foi debitado em caso de falha
    assert produto_mock.estoque == 5
    
    # Garante que nenhuma alteração foi persistida no banco (flush nunca executado)
    assert not session_mock.flush.called
