package similarity

import "fmt"

const windowLen = 2

func BuildStorage(texts []string) *LSHWorker {
	bands := 10
	rows := 2
	lshWorker := NewLSHWorker(bands, rows)
	for _, text := range texts {
		shingles := NewShingleExecutor(text, windowLen).TrimUnnecessary().RemoveRepeated().ShingleValue()
		oneHotVLoc := OneHotVectorLocation(shingles, windowLen)
		sigs := MinHash(oneHotVLoc, lshWorker.hashFuncs, pow(26, windowLen))

		fmt.Println(sigs)
		lshWorker.Add(sigs, text)
	}

	return lshWorker
}

func Test(lshWorker *LSHWorker, testedTexts []string) [][]string {
	res := [][]string{}
	for _, tested := range testedTexts {
		testedShingles := NewShingleExecutor(tested, windowLen).TrimUnnecessary().RemoveRepeated().ShingleValue()
		oneHotVLoc := OneHotVectorLocation(testedShingles, windowLen)
		sigs := MinHash(oneHotVLoc, lshWorker.hashFuncs, pow(26, windowLen))

		res = append(res, lshWorker.FindCandidates(sigs))
	}

	return res
}
