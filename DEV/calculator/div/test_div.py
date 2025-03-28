import pytest
from div import div

def test_div_positive_numbers():
    assert div(10, 2) == 5

def test_div_negative_numbers():
    assert div(-10, 2) == -5 

def test_div_floats():
    assert div(7.5, 2.5) == 3

def test_div_by_zero():
    with pytest.raises(ValueError, match="Não dá para dividir por 0"):
        div(10, 0)

