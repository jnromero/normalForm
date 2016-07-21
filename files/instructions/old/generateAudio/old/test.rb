say --rate=180 -f test.txt --interactive=black | \
  ruby -e 't=Time.now; e=0; while (x=STDIN.gets("\r")) do \
    y=x[/\e\[30m(.*)\e\(B/,1]; \
    STDOUT.printf("%.4f\t#{y}\n", e) if y; \
    e=Time.now-t \
  end'
