package foo;

import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.Collections;

import com.google.api.server.spi.auth.common.User;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.config.Nullable;
import com.google.api.server.spi.response.CollectionResponse;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.api.server.spi.auth.EspAuthenticator;

import com.google.appengine.api.datastore.Cursor;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.PropertyProjection;
import com.google.appengine.api.datastore.PreparedQuery.TooManyResultsException;
import com.google.appengine.api.datastore.Query.CompositeFilter;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.QueryResultList;
import com.google.appengine.api.datastore.Transaction;

@Api(name = "myApi",
     version = "v1",
     audiences = "418717520776-vd1hi1ukmn4494md8h75odm29dn05n8i.apps.googleusercontent.com",
     clientIds = {
        "418717520776-vd1hi1ukmn4494md8h75odm29dn05n8i.apps.googleusercontent.com"
     },
     namespace =
     @ApiNamespace(
		   ownerDomain = "helloworld.example.com",
		   ownerName = "helloworld.example.com",
		   packagePath = ""
		)
)

public class TripletEndpoint {

	@ApiMethod(name = "showTriplets", httpMethod = HttpMethod.GET)
	public PaginatedResult showTriplets(@Nullable @Named("offset") Integer offset, @Nullable @Named("limit") Integer limit) {
		if (offset == null) offset = 0;
		if (limit == null) limit = 100;
	
		Query q = new Query("Triplet");
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		PreparedQuery pq = datastore.prepare(q);

		int totalCount = pq.countEntities(FetchOptions.Builder.withDefaults());
		List<Entity> result = pq.asList(FetchOptions.Builder.withOffset(offset).limit(limit));
	
		return new PaginatedResult(result, totalCount);
	}

	@ApiMethod(name = "searchTriplet", httpMethod = HttpMethod.GET, path = "searchTriplet")
	public PaginatedResult searchTriplet(
		@Nullable @Named("subject") String subject,
		@Nullable @Named("predicate") String predicate,
		@Nullable @Named("object") String object,
		@Nullable @Named("offset") Integer offset,
		@Nullable @Named("limit") Integer limit
		) throws UnauthorizedException {
		
		Query q = new Query("Triplet");
		
		if (subject != null && !subject.isEmpty()) {
			q.setFilter(new FilterPredicate("subject", FilterOperator.EQUAL, subject));
		}
		
		if (predicate != null && !predicate.isEmpty()) {
			q.setFilter(new FilterPredicate("predicate", FilterOperator.EQUAL, predicate));
		}
		
		if (object != null && !object.isEmpty()) {
			q.setFilter(new FilterPredicate("object", FilterOperator.EQUAL, object));
		}
		
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		PreparedQuery pq = datastore.prepare(q);

		int totalCount = pq.countEntities(FetchOptions.Builder.withDefaults());
		List<Entity> result = pq.asList(FetchOptions.Builder.withLimit(100));
		return new PaginatedResult(result, totalCount);
	}

	@ApiMethod(name = "addTriplet", httpMethod = HttpMethod.GET)
	public Entity addTriplet(User user, @Named("subject") String subject, @Named("predicate") String predicate, @Named("object") String object) throws UnauthorizedException {
		System.out.println("The User is : " +user);
		if (user == null) {
			throw new UnauthorizedException("Invalid credentials");
		}
		Entity e = new Entity("Triplet", "" + subject + predicate + object);
		e.setProperty("subject", subject);
		e.setProperty("predicate", predicate);
		e.setProperty("object", object);

		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		datastore.put(e);

		return e;
	}
   	
}
