package similarity

const WORDS_RANGE = 26

type LSHWorker struct {
	bands      int
	rows       int
	shingleLen int
	dicLen     int // length of the dictionary defined by shingle length
	hashFuncs  []*HashFuncProps
	lookup     map[int]map[int64][]string // bandId -> numHash -> string
}

func (lw *LSHWorker) AddTextBySignature(text string, sig []int) {
	if len(sig) != lw.bands*lw.rows {
		panic("Length of Signature is not equal to bands * rows")
	}

	for i := 0; i < lw.bands; i++ {
		oneRowNums := sig[i*lw.rows : (i+1)*lw.rows]
		hashRes := numHash(oneRowNums)

		if lw.lookup[i] == nil {
			lw.lookup[i] = make(map[int64][]string)
		}

		if lw.lookup[i][hashRes] == nil {
			lw.lookup[i][hashRes] = []string{}
		}

		lw.lookup[i][hashRes] = append(lw.lookup[i][hashRes], text)
	}
}

func (lw *LSHWorker) AddText(text string) {
	sig := lw.Text2Signature(text)
	lw.AddTextBySignature(text, sig)
}

func (lw *LSHWorker) MultiAddText(texts []string) {
	for _, text := range texts {
		lw.AddText(text)
	}
}

func (lw *LSHWorker) FindCandidatesBySignature(sigs []int) []string {
	res := []string{}

	for i := 0; i < lw.bands; i++ {
		oneRowNums := sigs[i*lw.rows : (i+1)*lw.rows]
		hashRes := numHash(oneRowNums)

		res = append(res, lw.lookup[i][hashRes]...)
	}

	return RemoveRepeated(res)
}

func (lw *LSHWorker) FindCandidates(text string) []string {
	sig := lw.Text2Signature(text)
	return lw.FindCandidatesBySignature(sig)
}

func (lw *LSHWorker) Text2Signature(text string) []int {
	// shingling
	shingles := NewShingleExecutor(text, lw.shingleLen).ShingleValueSimple()

	// vectorise
	oneHotVLoc := OneHotVectorLocation(shingles, lw.shingleLen)

	// min-hash
	sig := MinHash(oneHotVLoc, lw.hashFuncs, lw.dicLen)

	return sig
}

func NewLSHWorker(bands, rows, shingleLen int) *LSHWorker {
	return &LSHWorker{
		bands:      bands,
		rows:       rows,
		shingleLen: shingleLen,
		dicLen:     pow(WORDS_RANGE, shingleLen),
		lookup:     make(map[int]map[int64][]string),
		hashFuncs:  GenerateHashFuncs(bands * rows),
	}
}
