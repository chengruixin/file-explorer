package similarity

type ShingleExecutor struct {
	text      string
	shingles  []string
	windowLen int
}

func (se *ShingleExecutor) ShingleValue() []string {
	if len(se.shingles) > 0 {
		return se.shingles
	}

	res := []string{}
	for i := 0; i < len(se.text)-se.windowLen+1; i++ {
		res = append(res, se.text[i:i+se.windowLen])
	}

	se.shingles = res

	return se.shingles
}

func (se *ShingleExecutor) TrimUnnecessary() *ShingleExecutor {
	res := []byte{}

	for _, r := range se.text {
		if (97 <= r && r <= 122) || (65 <= r && r <= 90) {
			res = append(res, byte(r))
		}
	}

	se.text = string(res)

	return se
}

func (se *ShingleExecutor) RemoveRepeated() *ShingleExecutor {
	se.shingles = RemoveRepeated(se.shingles)
	return se
}

func NewShingleExecutor(text string, windowLen int) *ShingleExecutor {
	return &ShingleExecutor{
		text:      text,
		windowLen: windowLen,
	}
}
