package similarity

type LSHWorker struct {
	bands     int
	rows      int
	hashFuncs []*HashFuncProps
	lookup    map[int]map[int64][]string // bandId -> numHash -> string
}

func (lw *LSHWorker) Add(sigs []int, text string) {
	if len(sigs) != lw.bands*lw.rows {
		panic("Length of Signature is not equal to bands * rows")
	}

	for i := 0; i < lw.bands; i++ {
		oneRowNums := sigs[i*lw.rows : (i+1)*lw.rows]
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

func (lw *LSHWorker) FindCandidates(sigs []int) []string {
	res := []string{}

	for i := 0; i < lw.bands; i++ {
		oneRowNums := sigs[i*lw.rows : (i+1)*lw.rows]
		hashRes := numHash(oneRowNums)

		res = append(res, lw.lookup[i][hashRes]...)
	}

	return res
}

func NewLSHWorker(bands, rows int) *LSHWorker {
	return &LSHWorker{
		bands:     bands,
		rows:      rows,
		lookup:    make(map[int]map[int64][]string),
		hashFuncs: GenerateHashFuncs(bands * rows),
	}
}
