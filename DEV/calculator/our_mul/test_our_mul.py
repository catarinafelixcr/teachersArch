from our_mul import our_mul

def test_trivial_sub():
    assert our_mul(5, 3) == 15, "Should be 15"

def test_for_negatives():
    assert our_mul(-2, -3) == 15, "Should be 15"

def test_for_mixed():
    assert our_mul(-2, 3) == -5, "Should be -5(error)"
