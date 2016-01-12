package de.bschandera;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.List;
import java.util.stream.Collectors;

public class Dictionary {
    private final List<String> words;

    public Dictionary(Integer wordLength) {
        try {
            words = Resources.readLines(Resources.getResource("dictionary-de-04"), Charsets.UTF_8).parallelStream()
                    .filter(word -> word.length() == wordLength)
                    .map(String::toLowerCase)
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    public boolean containsExactly(String word) {
        return words.contains(word.toLowerCase());
    }
}
