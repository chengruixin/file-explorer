package similarity

type ShingleExecutor struct {
	text            string
	shinglesSimple  []string
	shinglesComplex []string
	windowLen       int
}

func shingling(str string, windowLen int) []string {
	res := []string{}
	for i := 0; i < len(str)-windowLen+1; i++ {
		res = append(res, str[i:i+windowLen])
	}
	return res
}

func (se *ShingleExecutor) ShingleValueSimple() []string {
	if se.shinglesSimple != nil && len(se.shinglesSimple) > 0 {
		return se.shinglesSimple
	}

	se.shinglesSimple = RemoveRepeated(shingling(se.text, se.windowLen))

	return se.shinglesSimple
}

func (se *ShingleExecutor) ShingleValueComplex() []string {
	if se.shinglesComplex != nil && len(se.shinglesComplex) > 0 {
		return se.shinglesComplex
	}
	res := []string{}
	for i := se.windowLen; i >= 1; i-- {
		res = append(res, RemoveRepeated(shingling(se.text, i))...)
	}

	se.shinglesComplex = res

	return se.shinglesComplex
}

func (se *ShingleExecutor) trimUnnecessary() *ShingleExecutor {
	res := []byte{}

	for _, r := range se.text {
		if (97 <= r && r <= 122) || (65 <= r && r <= 90) {
			res = append(res, byte(r))
		}
	}

	se.text = string(res)

	return se
}

func NewShingleExecutor(text string, windowLen int) *ShingleExecutor {
	res := &ShingleExecutor{
		text:      text,
		windowLen: windowLen,
	}

	res.trimUnnecessary()

	return res
}
