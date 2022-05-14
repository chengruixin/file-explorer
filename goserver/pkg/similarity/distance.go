package similarity

func Jaccard(sig1 []int, sig2 []int) float32 {
	sims := 0
	for i := range sig1 {
		if sig1[i] == sig2[i] {
			sims++
		}
	}
	return float32(sims) / float32(len(sig1))
}

func JaccardIgnoreZero(sig1 []int, sig2 []int) float32 {
	sims, count := 0, 0

	for i := range sig1 {
		if sig1[i] == sig2[i] && sig1[i] != 0 {
			sims++
		}

		if sig1[i] == sig2[i] && sig1[i] == 0 {
			count++
		}
	}

	return float32(sims) / float32(len(sig1)-count)

}
