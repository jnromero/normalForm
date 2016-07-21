rm output.txt
say --rate=160 -v "Tom" -f addedSilence.txt --interactive=black | \
  ruby -e 't=Time.now; e=0; while (x=STDIN.gets("\r")) do \
    y=x[/\e\[30m(.*)\e\(B/,1]; \
    STDOUT.printf("%.4f\t#{y}\n", e) if y; \
    e=Time.now-t \
  end' >> output.txt