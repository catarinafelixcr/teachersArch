from calculator.add.add import add 

def test_trivial_add():     
    assert add(2, 3 ) == 5, "Should be 5" 
    
def test_for_negatives():     
    assert add(-2, -3) == -5, "Should be -5"     
    
def test_for_mixed():     
    assert add(-2, 3) == 0, "Should be 1 (error)"