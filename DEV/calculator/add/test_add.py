from our_add import our_add 

def test_trivial_add():     
    assert our_add(2, 3 ) == 5, "Should be 5" 
    
def test_for_negatives():     
    assert our_add(-2, -3) == -5, "Should be -5"     
    
def test_for_mixed():     
    assert our_add(-2, 3) == 0, "Should be 1 (error)"