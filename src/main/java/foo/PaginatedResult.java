package foo;

import java.util.List;
import com.google.appengine.api.datastore.Entity;


public class PaginatedResult {
    public List<Entity> items;
    public int totalCount;

    public PaginatedResult(List<Entity> items, int totalCount) {
        this.items = items;
        this.totalCount = totalCount;
    }
}

