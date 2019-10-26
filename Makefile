all: readme v8 v10 v12 v13

readme: README.md
	markedpp --githubid -i $< -o $<

v%:
	n $@ && npm test

.PHONY: all readme
