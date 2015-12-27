all: readme v0.12 v4.2 v5.2

readme: README.md
	markedpp --githubid -i $< -o $<

v%:
	n $@ && npm test

.PHONY: all readme