# supabase_s3_issue
Demo of the s3 issue

to test, start the server with:
```sh
supabase start
```

then run the test:

```sh
bun run test:s3
```

This will run 3 set of test who should work, using the s3 aws official package or supabase one.

We tried to do with supabase sdk, aws official sdk ( in the code we tried 3 kind of import, none work )

And lastly a pure jsr sdk @bradenmacdonald/s3-lite-client
